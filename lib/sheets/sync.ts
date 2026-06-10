import { google } from "googleapis";
import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/server";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_TAB = "Master Log";
const DATA_START_ROW = 5; // rows 1-2: KPI bar, row 4: header, row 5+: data

/** Convert NZ date "DD/MM/YYYY" → Postgres "YYYY-MM-DD". Returns null if unparseable. */
function parseNZDate(raw: string): string | null {
  const m = raw?.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const [, d, mo, y] = m;
  return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

export async function syncSheetsToSupabase(): Promise<{ synced: number; skipped: number; deleted: number }> {
  // ── 1. Authenticate with Google ──────────────────────────────────────────
  // Use individual env vars instead of full JSON to avoid .env.local line-break issues.
  // GOOGLE_PRIVATE_KEY stores literal \n sequences — replace them with real newlines.
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL!,
      private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  // ── 2. Read Master Log (columns A–K, data rows only) ─────────────────────
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_TAB}!A${DATA_START_ROW}:K`,
  });
  const rows = res.data.values ?? [];

  // ── 3. Load client name → id map from Supabase ───────────────────────────
  const supabase = createAdminClient();
  const { data: clientRows, error: clientErr } = await supabase
    .from("clients")
    .select("id, name");
  if (clientErr) throw new Error(`Failed to fetch clients: ${clientErr.message}`);

  const clientMap = new Map<string, string>(
    (clientRows ?? []).map((c) => [c.name, c.id])
  );

  // ── 4. Parse rows → upsert records ───────────────────────────────────────
  // One timestamp for the whole run: every current row gets stamped with it, so
  // any waste_log row left with an OLDER stamp afterwards no longer exists in the
  // sheet and can be deleted (keeps Supabase correct when rows are removed/edited).
  const runStamp = new Date().toISOString();
  const { count: existingCount } = await supabase
    .from("waste_log")
    .select("id", { count: "exact", head: true });
  const records: object[] = [];
  let skipped = 0;
  // Stable, position-independent key per row: a hash of all 8 columns, plus an
  // occurrence index so genuinely identical rows don't collide. This keeps a
  // given pickup's external_id constant no matter how the Master Log re-sorts,
  // so adding/removing a pickup touches exactly one row (no churn, no
  // sensitivity to mid-recompute reads).
  const seen = new Map<string, number>();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    // A=0:Timestamp  B=1:PickupDate  C=2:Client  D=3:Location  E=4:WasteType
    // F=5:BinNumber  G=6:WeightKg   H=7:Notes
    const clientName = row[2]?.trim();
    const pickupDate = parseNZDate(row[1] ?? "");
    const weightKg = parseFloat(row[6]);

    if (!clientName || !pickupDate || isNaN(weightKg) || weightKg <= 0) {
      skipped++;
      continue;
    }

    let clientId = clientMap.get(clientName);
    if (!clientId) {
      // Auto-register unknown client so the sync doesn't silently drop rows
      const { data: newClient, error: insertErr } = await supabase
        .from("clients")
        .insert({ name: clientName })
        .select("id")
        .single();
      if (insertErr || !newClient) { skipped++; continue; }
      clientId = newClient.id as string;
      clientMap.set(clientName, clientId);
    }

    // Content key from all 8 source columns; disambiguate identical rows.
    const contentKey = [0, 1, 2, 3, 4, 5, 6, 7].map((c) => (row[c] ?? "").toString().trim()).join("");
    const occ = (seen.get(contentKey) ?? 0) + 1;
    seen.set(contentKey, occ);
    const externalId = "ml_" + createHash("sha1").update(`${contentKey}#${occ}`).digest("hex").slice(0, 24);

    records.push({
      external_id: externalId,
      client_id: clientId,
      pickup_date: pickupDate,
      location_site: row[3]?.trim() || null,
      waste_type: row[4]?.trim() || null,
      bin_number: row[5]?.trim() || null,
      weight_kg: weightKg,
      notes: row[7]?.trim() || null,
      synced_at: runStamp,
    });
  }

  // Safety: never wipe waste_log if the sheet read came back empty/broken.
  if (records.length === 0) return { synced: 0, skipped, deleted: 0 };

  const { error: upsertErr } = await supabase
    .from("waste_log")
    .upsert(records, { onConflict: "external_id" });

  if (upsertErr) throw new Error(`Upsert failed: ${upsertErr.message}`);

  // Remove rows that weren't part of this run (deleted/edited in the sheet).
  // Safety guard: if this run read far fewer rows than already exist, the sheet
  // was probably mid-recompute (a partial read) — skip the delete so we never
  // wipe valid rows. The next clean sync reconciles.
  if (records.length < (existingCount ?? 0) * 0.8) {
    return { synced: records.length, skipped, deleted: 0 };
  }

  const { error: delErr, count: deleted } = await supabase
    .from("waste_log")
    .delete({ count: "exact" })
    .lt("synced_at", runStamp);

  if (delErr) throw new Error(`Stale cleanup failed: ${delErr.message}`);

  return { synced: records.length, skipped, deleted: deleted ?? 0 };
}

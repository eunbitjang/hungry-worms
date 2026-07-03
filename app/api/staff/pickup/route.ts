import { NextResponse, after } from "next/server";
import { revalidatePath } from "next/cache";
import { PICKUP_CLIENTS } from "@/lib/staff/pickup-config";
import {
  appendPickupRows,
  MissingSheetsCredentialsError,
  type CanonicalRow,
} from "@/lib/sheets/pickup";
import { syncSheetsToSupabase } from "@/lib/sheets/sync";

export const runtime = "nodejs";

/** Date/time parts in NZ local time, regardless of server timezone. */
function nzParts(): Record<string, string> {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Pacific/Auckland",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  return Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
}

function nzTimestamp(): string {
  const p = nzParts();
  return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}:${p.second}`;
}

/** Accept "YYYY-MM-DD" from the date input → "DD/MM/YYYY"; default to NZ today. */
function resolvePickupDate(input: unknown): string {
  if (typeof input === "string") {
    const m = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  }
  const p = nzParts();
  return `${p.day}/${p.month}/${p.year}`;
}

type Entry = {
  boxIndex?: number;
  kg?: number | string;
  waste?: string;
  location?: string;
  capacity?: string;
};

export async function POST(req: Request) {
  // ── Open write path — no login required ───────────────────────────────────
  // Pickups can be logged by anyone so field staff don't have to sign in.
  // Input is still validated server-side against the canonical PICKUP_CLIENTS
  // config below (only known clients/boxes/waste-types are accepted), and the
  // sheet write uses the server's own service account, never the caller's.

  // ── Parse + validate payload against the canonical config ─────────────────
  let body: {
    client?: string;
    pickupDate?: unknown;
    notes?: unknown;
    entries?: Entry[];
    requestId?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const cfg = body.client ? PICKUP_CLIENTS[body.client] : undefined;
  if (!cfg) return NextResponse.json({ error: "Unknown client" }, { status: 400 });

  // Idempotency key from the client — stable across retries of one form fill, so
  // a lost response doesn't turn a retry into a duplicate row. Bounded length to
  // reject junk. Absent/invalid → dedup is simply skipped (still safe).
  const requestId =
    typeof body.requestId === "string" && /^[\w-]{1,64}$/.test(body.requestId)
      ? body.requestId
      : undefined;
  if (!Array.isArray(body.entries) || body.entries.length === 0) {
    return NextResponse.json({ error: "No pickup entries provided" }, { status: 400 });
  }

  const timestamp = nzTimestamp();
  const pickupDate = resolvePickupDate(body.pickupDate);
  const storeName = cfg.store ?? body.client!;
  const notes = typeof body.notes === "string" ? body.notes.trim() : "";

  const rows: CanonicalRow[] = [];
  for (const e of body.entries) {
    const box = typeof e.boxIndex === "number" ? cfg.boxes[e.boxIndex] : undefined;
    const kg = Number(e.kg);
    if (!box || !Number.isFinite(kg) || kg <= 0 || kg > 1000) continue;

    let wasteType = box.waste ?? "";
    let location = "";
    let binNumber = "";

    if (box.wasteOptions) {
      if (!box.wasteOptions.includes(e.waste as string)) continue;
      wasteType = e.waste as string;
    }
    if (box.locationOptions) {
      if (!box.locationOptions.includes(e.location as string)) continue;
      location = e.location as string;
    }
    if (box.capacityOptions) {
      if (!box.capacityOptions.includes(e.capacity as string)) continue;
      binNumber = e.capacity as string;
    }
    if (!wasteType) continue; // safety — every row needs a Waste Type

    rows.push({
      timestamp,
      pickupDate,
      client: storeName,
      location,
      wasteType,
      binNumber,
      weightKg: Math.round(kg * 100) / 100,
      notes,
    });
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: "No valid weights to save" }, { status: 400 });
  }

  // ── Write to the sheet ────────────────────────────────────────────────────
  let duplicate = false;
  try {
    ({ duplicate } = await appendPickupRows(rows, requestId));
  } catch (err) {
    console.error("App Pickups append failed:", err);
    if (err instanceof MissingSheetsCredentialsError) {
      // Server isn't configured (Google env vars absent) — not a sheet-permission issue.
      return NextResponse.json(
        { error: "Server isn't configured to save pickups yet. Please contact the site admin." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Couldn't save to the sheet. Check the service account has edit access." },
      { status: 502 }
    );
  }

  // ── Push to the website in the background ─────────────────────────────────
  // The pickup is already safely in the sheet, so we respond immediately and
  // sync Sheets → Supabase afterwards. The short delay lets the Master Log's
  // spilled formula recompute to include the new rows before the sync reads it.
  // On a duplicate retry nothing new was written, so skip the sync entirely.
  if (!duplicate) {
    after(async () => {
      try {
        // Let the Master Log's spilled formula finish re-sorting in the new rows.
        await new Promise((r) => setTimeout(r, 12000));
        await syncSheetsToSupabase();
        revalidatePath("/"); // refresh the public hero scorecard
      } catch (e) {
        console.error("[pickup] post-write sync failed (will catch up on next sync):", e);
      }
    });
  }

  // Report success whether we just wrote the rows or recognised a retry of an
  // already-saved submission — either way the pickup is safely logged once.
  return NextResponse.json({
    ok: true,
    saved: rows.length,
    duplicate,
    client: storeName,
    pickupDate,
    totalKg: Math.round(rows.reduce((s, r) => s + r.weightKg, 0) * 10) / 10,
  });
}

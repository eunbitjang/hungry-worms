import { google } from "googleapis";

/**
 * Writes staff-logged pickups to a dedicated `App Pickups` tab that mirrors the
 * 8 columns of `Form responses 1`. The team's Master Log combines
 * `Form responses 1` + `Historical` + `App Pickups`, so the existing
 * Supabase sync → hero + portal keep working unchanged. We never touch the
 * Google Form's own response tab.
 *
 * Requires the service account to have EDIT access to the spreadsheet.
 */

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const TAB = "App Pickups";

// Same column order as `Form responses 1` (cols A–H).
const HEADER = [
  "Timestamp",
  "Pickup Date",
  "Client",
  "Location / Site",
  "Waste Type",
  "Bin Number",
  "Weight kg",
  "Notes",
];

export type CanonicalRow = {
  timestamp: string; // "DD/MM/YYYY HH:MM:SS" (NZ local)
  pickupDate: string; // "DD/MM/YYYY"
  client: string;
  location: string;
  wasteType: string;
  binNumber: string;
  weightKg: number;
  notes: string;
};

/** Thrown when the Google service-account env vars aren't configured (e.g. on Vercel). */
export class MissingSheetsCredentialsError extends Error {
  constructor(missing: string[]) {
    super(`Google Sheets credentials not configured — missing env var(s): ${missing.join(", ")}`);
    this.name = "MissingSheetsCredentialsError";
  }
}

function getSheets() {
  // Individual env vars (not full JSON) to avoid .env line-break issues.
  // GOOGLE_PRIVATE_KEY stores literal \n sequences — restore real newlines.
  const missing = (["GOOGLE_SHEET_ID", "GOOGLE_CLIENT_EMAIL", "GOOGLE_PRIVATE_KEY"] as const).filter(
    (k) => !process.env[k]
  );
  if (missing.length > 0) throw new MissingSheetsCredentialsError(missing);

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL!,
      private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"], // read + WRITE
  });
  return google.sheets({ version: "v4", auth });
}

type SheetsClient = ReturnType<typeof getSheets>;

/** Create the `App Pickups` tab (with a header row) the first time it's needed. */
async function ensureTab(sheets: SheetsClient): Promise<void> {
  const meta = await sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID,
    fields: "sheets.properties.title",
  });
  const exists = (meta.data.sheets ?? []).some(
    (s) => s.properties?.title === TAB
  );
  if (exists) return;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: { requests: [{ addSheet: { properties: { title: TAB } } }] },
  });
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A1`,
    valueInputOption: "RAW",
    requestBody: { values: [HEADER] },
  });
}

/**
 * Append canonical rows to `App Pickups`. Returns the number of rows written.
 * Uses USER_ENTERED so Sheets parses dates/numbers exactly like Form rows.
 */
export async function appendPickupRows(rows: CanonicalRow[]): Promise<number> {
  if (rows.length === 0) return 0;

  const sheets = getSheets();
  await ensureTab(sheets);

  const values = rows.map((r) => [
    r.timestamp,
    r.pickupDate,
    r.client,
    r.location,
    r.wasteType,
    r.binNumber,
    r.weightKg,
    r.notes,
  ]);

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A:H`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values },
  });

  return rows.length;
}

/* ── Editing rows already in `App Pickups` ─────────────────────────────────
 *
 * Staff fix their own mistakes from the portal instead of opening the sheet.
 * Only the `App Pickups` tab is editable this way — rows that came from the
 * old Google Form or the `Historical` tab are untouched.
 *
 * Rows are addressed by their sheet row number, which shifts whenever a row
 * above is deleted. So every edit/delete carries the 8 cell values the
 * browser was shown (`expected`), and we re-read the row and refuse to write
 * if it no longer matches — an edit can never land on the wrong pickup.
 */

/** A row of `App Pickups` as Sheets displays it (formatted values). */
export type AppPickupRow = {
  row: number; // 1-based sheet row number
  values: string[]; // A–H, formatted, trimmed — also the concurrency token
};

/** Thrown when the row changed (or moved) since the caller last listed it. */
export class RowChangedError extends Error {
  constructor() {
    super("This pickup changed since you loaded the list. Reload and try again.");
    this.name = "RowChangedError";
  }
}

const normalise = (r: unknown[] | undefined): string[] =>
  Array.from({ length: HEADER.length }, (_, c) => String(r?.[c] ?? "").trim());

/** The most recent `limit` rows of `App Pickups`, newest first. */
export async function listAppPickups(limit = 200): Promise<AppPickupRow[]> {
  const sheets = getSheets();
  await ensureTab(sheets);
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A2:H`,
  });
  const out: AppPickupRow[] = [];
  (res.data.values ?? []).forEach((r, i) => {
    const values = normalise(r);
    if (values.some(Boolean)) out.push({ row: i + 2, values });
  });
  return out.slice(-limit).reverse();
}

async function assertUnchanged(sheets: SheetsClient, row: number, expected: string[]) {
  if (!Number.isInteger(row) || row < 2) throw new RowChangedError();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A${row}:H${row}`,
  });
  const current = normalise(res.data.values?.[0]);
  const wanted = normalise(expected);
  if (current.some((v, c) => v !== wanted[c])) throw new RowChangedError();
}

/** Overwrite columns B–H of one row. The original Timestamp (A) is kept. */
export async function updateAppPickupRow(
  row: number,
  expected: string[],
  next: Omit<CanonicalRow, "timestamp">
): Promise<void> {
  const sheets = getSheets();
  await assertUnchanged(sheets, row, expected);
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!B${row}:H${row}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [next.pickupDate, next.client, next.location, next.wasteType, next.binNumber, next.weightKg, next.notes],
      ],
    },
  });
}

/** Remove one row entirely, so the Master Log stops counting it. */
export async function deleteAppPickupRow(row: number, expected: string[]): Promise<void> {
  const sheets = getSheets();
  await assertUnchanged(sheets, row, expected);
  const meta = await sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID,
    fields: "sheets.properties(sheetId,title)",
  });
  const sheetId = meta.data.sheets?.find((s) => s.properties?.title === TAB)?.properties?.sheetId;
  if (sheetId == null) throw new RowChangedError();
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [
        { deleteDimension: { range: { sheetId, dimension: "ROWS", startIndex: row - 1, endIndex: row } } },
      ],
    },
  });
}

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

// Cols A–H mirror `Form responses 1` (the Master Log combines them and the
// Supabase sync only reads A–H). Col I is an app-only idempotency key: it is
// invisible to the Master Log formula and the sync, so it never touches client
// data — it only lets us recognise a re-submitted pickup and skip re-appending.
const HEADER = [
  "Timestamp",
  "Pickup Date",
  "Client",
  "Location / Site",
  "Waste Type",
  "Bin Number",
  "Weight kg",
  "Notes",
  "Request ID",
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
 * True if a pickup with this Request ID has already been written. Used to make
 * the write path idempotent: if a submit reaches the server but its response is
 * lost (flaky field network), the retry carries the same Request ID and we skip
 * the duplicate append instead of piling up rows in the Master Log.
 */
async function requestAlreadyLogged(
  sheets: SheetsClient,
  requestId: string
): Promise<boolean> {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!I2:I`, // Request ID column, data rows only
  });
  const ids = res.data.values ?? [];
  return ids.some((r) => (r[0] ?? "").toString().trim() === requestId);
}

/**
 * Append canonical rows to `App Pickups`. Returns how many rows were written and
 * whether the write was skipped as a duplicate retry.
 *
 * When `requestId` is supplied, every row of this submission is tagged with it
 * in col I, and a matching prior submission short-circuits the append (idempotent
 * retry). Uses USER_ENTERED so Sheets parses dates/numbers exactly like Form rows.
 */
export async function appendPickupRows(
  rows: CanonicalRow[],
  requestId?: string
): Promise<{ written: number; duplicate: boolean }> {
  if (rows.length === 0) return { written: 0, duplicate: false };

  const sheets = getSheets();
  await ensureTab(sheets);

  // Idempotency guard: don't re-append a submission we've already recorded.
  if (requestId && (await requestAlreadyLogged(sheets, requestId))) {
    return { written: 0, duplicate: true };
  }

  const values = rows.map((r) => [
    r.timestamp,
    r.pickupDate,
    r.client,
    r.location,
    r.wasteType,
    r.binNumber,
    r.weightKg,
    r.notes,
    requestId ?? "",
  ]);

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A:I`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values },
  });

  return { written: rows.length, duplicate: false };
}

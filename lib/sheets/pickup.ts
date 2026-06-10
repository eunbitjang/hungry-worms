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

function getSheets() {
  // Individual env vars (not full JSON) to avoid .env line-break issues.
  // GOOGLE_PRIVATE_KEY stores literal \n sequences — restore real newlines.
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

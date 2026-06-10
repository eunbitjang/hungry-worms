// Verify the service account now has WRITE access, and provision the
// `App Pickups` tab (header only — no data rows) so the form is ready.
//   node --env-file=.env.local scripts/verify-sheet-write.mjs

import { google } from "googleapis";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const TAB = "App Pickups";
const HEADER = [
  "Timestamp", "Pickup Date", "Client", "Location / Site",
  "Waste Type", "Bin Number", "Weight kg", "Notes",
];

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

const meta = await sheets.spreadsheets.get({
  spreadsheetId: SHEET_ID,
  fields: "sheets.properties.title",
});
const titles = (meta.data.sheets ?? []).map((s) => s.properties.title);
console.log("Existing tabs:", titles.join(" | "));

if (titles.includes(TAB)) {
  console.log(`'${TAB}' already exists — write access confirmed (read OK).`);
} else {
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
  console.log(`✅ Created '${TAB}' with header row — WRITE access confirmed.`);
}

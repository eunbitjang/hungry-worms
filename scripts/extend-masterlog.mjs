// Surgically extend the Master Log combine formula (cell A4) to also include
// the `App Pickups` tab, alongside Historical + Form responses 1.
// Safe: backs up the original formula, writes the new one, verifies the sheet
// still spills correctly (header + numeric total), and ROLLS BACK on any problem.
//   node --env-file=.env.local scripts/extend-masterlog.mjs

import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });
const ID = process.env.GOOGLE_SHEET_ID;

const A4 = "Master Log!A4";

async function getFormula(range) {
  const r = await sheets.spreadsheets.values.get({ spreadsheetId: ID, range, valueRenderOption: "FORMULA" });
  return r.data.values?.[0]?.[0] ?? "";
}
async function setFormula(range, formula) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: ID, range, valueInputOption: "USER_ENTERED", requestBody: { values: [[formula]] },
  });
}

const original = await getFormula(A4);
console.log("Backup of original A4 formula:\n", original, "\n");

if (original.includes("App Pickups")) {
  console.log("✓ App Pickups is already in the Master Log formula — nothing to do.");
  process.exit(0);
}

// Replace the `src,{Historical;Form}` definition with a `base,{Historical;Form}`
// plus a `src` that conditionally stacks App Pickups ONLY when it has rows
// (COUNTA > 0). While App Pickups is empty, src == base, so the Master Log is
// byte-for-byte identical to the original — no blank rows. When Mark logs a
// pickup, its rows join automatically.
const find = `src,{FILTER(Historical!A2:H,Historical!B2:B<>"");FILTER('Form responses 1'!A2:H,'Form responses 1'!B2:B<>"")},`;
const replace = `base,{FILTER(Historical!A2:H,Historical!B2:B<>"");FILTER('Form responses 1'!A2:H,'Form responses 1'!B2:B<>"")},src,IF(COUNTA('App Pickups'!B2:B)>0,{base;FILTER('App Pickups'!A2:H,'App Pickups'!B2:B<>"")},base),`;

if (!original.includes(find)) {
  console.error("✗ Could not find the expected src definition. Aborting (no change made).");
  console.error("  The Master Log formula differs from what was expected — please review manually.");
  process.exit(1);
}

const updated = original.replace(find, replace);
console.log("New A4 formula:\n", updated, "\n");

await setFormula(A4, updated);

// ── Verify ────────────────────────────────────────────────────────────────
const check = await sheets.spreadsheets.values.get({
  spreadsheetId: ID, range: "Master Log!A1:K5", valueRenderOption: "FORMATTED_VALUE",
});
const rows = check.data.values ?? [];
const totalWaste = rows[0]?.[1]; // B1 = =SUM(G5:G)
const headerCell = rows[3]?.[0]; // A4 = "Timestamp"
const firstClient = rows[4]?.[2]; // C5 = a client name

const totalNum = Number(String(totalWaste).replace(/[^0-9.]/g, ""));
const ok =
  headerCell === "Timestamp" &&
  typeof firstClient === "string" && firstClient.length > 0 && !firstClient.startsWith("#") &&
  Number.isFinite(totalNum) && totalNum > 1000;

if (ok) {
  console.log(`✅ SUCCESS — Master Log still healthy.`);
  console.log(`   Header A4 = "${headerCell}" · first client = "${firstClient}" · TOTAL waste = ${totalWaste}`);
  console.log(`   App Pickups rows will now flow into Master Log automatically.`);
} else {
  console.error("✗ Verification FAILED — rolling back to the original formula.");
  console.error(`   header="${headerCell}" firstClient="${firstClient}" total="${totalWaste}"`);
  await setFormula(A4, original);
  console.error("↩ Rolled back. No net change to the Master Log.");
  process.exit(1);
}

// Full pipeline test through Supabase, with clean teardown.
//   node --env-file=.env.local scripts/e2e-supabase.mjs   (dev server must be running)
import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";

const auth = new google.auth.GoogleAuth({
  credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL, private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n") },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });
const ID = process.env.GOOGLE_SHEET_ID;
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const runSync = async () => {
  const res = await fetch("http://localhost:3000/api/sync", { method: "POST", headers: { "x-sync-token": process.env.SYNC_SECRET } });
  return res.json();
};
const stats = async () => {
  const { count } = await sb.from("waste_log").select("id", { count: "exact", head: true });
  const { data } = await sb.from("waste_log").select("notes").eq("notes", "E2E-TEST");
  return { count, testRows: data?.length ?? 0 };
};

console.log("Baseline sync…");
console.log(" ", await runSync());
console.log("  Supabase:", await stats());

console.log("\n1) Add test pickup to App Pickups (Willowbank 7kg) …");
const ap = await sheets.spreadsheets.values.append({
  spreadsheetId: ID, range: "App Pickups!A:H", valueInputOption: "USER_ENTERED", insertDataOption: "INSERT_ROWS",
  requestBody: { values: [["10/06/2026 09:00:00", "10/06/2026", "Willowbank Wildlife Reserve", "", "Food waste", "", 7, "E2E-TEST"]] },
});
await sleep(12000);
console.log("   sync:", await runSync());
const afterAdd = await stats();
console.log("   Supabase:", afterAdd, afterAdd.testRows === 1 ? "✅ test pickup reached the website DB" : "❌ not found");

console.log("\n2) Remove the test pickup …");
await sheets.spreadsheets.values.clear({ spreadsheetId: ID, range: ap.data.updates.updatedRange });
await sleep(12000);
console.log("   sync:", await runSync());
const afterDel = await stats();
console.log("   Supabase:", afterDel, afterDel.testRows === 0 ? "✅ cleaned up — stale row removed" : "❌ still present");

console.log("\nDone.", afterDel.testRows === 0 && afterAdd.testRows === 1 ? "FULL PIPELINE VERIFIED ✅" : "⚠️ review");

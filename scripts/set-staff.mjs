// Toggle the `is_staff` flag on a portal account so it can reach the
// staff-only "Log a Pickup" form.
//
//   node --env-file=.env.local scripts/set-staff.mjs info@hungryworms.nz true
//   node --env-file=.env.local scripts/set-staff.mjs info@hungryworms.nz false

import { createClient } from "@supabase/supabase-js";

const email = process.argv[2];
const value = (process.argv[3] ?? "true").toLowerCase() !== "false";

if (!email) {
  console.error("Usage: node --env-file=.env.local scripts/set-staff.mjs <email> [true|false]");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function findUserByEmail(target) {
  let page = 1;
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const u = data.users.find((u) => u.email?.toLowerCase() === target.toLowerCase());
    if (u) return u;
    if (data.users.length < 200) return null;
    page++;
  }
}

const user = await findUserByEmail(email);
if (!user) {
  console.error(`No auth user found for ${email}`);
  process.exit(1);
}

const { error } = await supabase
  .from("profiles")
  .update({ is_staff: value })
  .eq("id", user.id);

if (error) {
  console.error("Failed to update profile:", error.message);
  process.exit(1);
}

console.log(`✅ ${email} → is_staff = ${value}`);

// One-off: provision a portal test account for info@hungryworms.nz
// Run with:  node --env-file=.env.local scripts/setup-test-user.mjs
//
// Creates (or updates) the auth user with a known password, then maps it via a
// `profiles` row to whichever client currently has the most waste_log data, so
// the dashboard shows a realistic, populated customer view.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const EMAIL = "info@hungryworms.nz";
const PASSWORD = process.env.TEST_PORTAL_PASSWORD || "HungryWorms2026!";

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function pickBiggestClient() {
  const { data: clients, error } = await supabase.from("clients").select("id, name");
  if (error) throw error;

  let best = null;
  for (const c of clients) {
    const { count } = await supabase
      .from("waste_log")
      .select("id", { count: "exact", head: true })
      .eq("client_id", c.id);
    console.log(`  ${c.name}: ${count ?? 0} rows`);
    if (!best || (count ?? 0) > best.count) best = { ...c, count: count ?? 0 };
  }
  return best;
}

async function findUserByEmail(email) {
  let page = 1;
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const u = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (u) return u;
    if (data.users.length < 200) return null;
    page++;
  }
}

async function main() {
  console.log("Client data counts:");
  const client = await pickBiggestClient();
  console.log(`\nSelected client → ${client.name} (${client.count} rows)\n`);

  // Create or update the auth user
  let userId;
  const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
  });

  if (createErr) {
    if (/already|exist|registered/i.test(createErr.message)) {
      const existing = await findUserByEmail(EMAIL);
      if (!existing) throw new Error(`User reported as existing but not found: ${createErr.message}`);
      userId = existing.id;
      await supabase.auth.admin.updateUserById(userId, { password: PASSWORD, email_confirm: true });
      console.log("Existing user updated with new password:", userId);
    } else {
      throw createErr;
    }
  } else {
    userId = created.user.id;
    console.log("User created:", userId);
  }

  // Map the user to the chosen client
  const { error: pErr } = await supabase.from("profiles").upsert(
    {
      id: userId,
      client_id: client.id,
      contact_name: "Hungry Worms (Demo)",
      email: EMAIL,
      is_staff: false,
    },
    { onConflict: "id" }
  );
  if (pErr) throw pErr;

  console.log(`Profile mapped → ${client.name}`);
  console.log("\n✅ DONE");
  console.log("   Email:    ", EMAIL);
  console.log("   Password: ", PASSWORD);
  console.log("   Sees:     ", client.name, "dashboard");
}

main().catch((e) => {
  console.error("\n❌ Failed:", e.message || e);
  process.exit(1);
});

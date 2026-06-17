import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import StaffHub from "./StaffHub";

export const metadata: Metadata = {
  title: "Staff Portal | Hungry Worms",
};

export default async function StaffPortalPage() {
  const supabase = await createClient();

  // Open to everyone — no login required, so field staff can log pickups
  // without signing in. We still surface the email if someone happens to be
  // logged in. (The all-clients dashboard linked from here stays protected.)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <StaffHub staffEmail={user?.email ?? ""} />;
}

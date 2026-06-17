import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import PickupForm from "./PickupForm";

export const metadata: Metadata = {
  title: "Log a Pickup | Hungry Worms Staff",
};

export default async function StaffPickupPage() {
  const supabase = await createClient();

  // Open to everyone — no login required, so field staff can log pickups
  // without signing in. Surface the email only if someone is logged in.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <PickupForm staffEmail={user?.email ?? ""} />;
}

import { createClient } from "@/lib/supabase/server";
import { getClientSettings } from "@/lib/staff/client-settings";
import type { Metadata } from "next";
import PickupForm from "./PickupForm";

export const metadata: Metadata = {
  title: "Log a Pickup · Staff",
};

export default async function StaffPickupPage() {
  const supabase = await createClient();

  // Open to everyone — no login required, so field staff can log pickups
  // without signing in. Surface the email only if someone is logged in.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { clients } = await getClientSettings();

  return <PickupForm staffEmail={user?.email ?? ""} clients={clients.filter((c) => c.active)} />;
}

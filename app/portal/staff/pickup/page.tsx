import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import PickupForm from "./PickupForm";

export const metadata: Metadata = {
  title: "Log a Pickup | Hungry Worms Staff",
};

export default async function StaffPickupPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_staff")
    .eq("id", user.id)
    .single();

  // Staff-only — normal client logins go back to their dashboard.
  if (!profile?.is_staff) redirect("/portal/dashboard");

  return <PickupForm staffEmail={user.email ?? ""} />;
}

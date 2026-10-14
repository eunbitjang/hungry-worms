import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import PickupFixer from "./PickupFixer";

export const metadata: Metadata = {
  title: "Fix a Pickup · Staff",
};

export default async function FixPickupsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal?next=/portal/staff/pickups");

  const { data: profile } = await supabase.from("profiles").select("is_staff").eq("id", user.id).single();
  if (!profile?.is_staff) redirect("/portal/dashboard");

  return <PickupFixer staffEmail={user.email ?? ""} />;
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import StaffHub from "./StaffHub";

export const metadata: Metadata = {
  title: "Staff Portal | Hungry Worms",
};

export default async function StaffPortalPage() {
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
  if (!profile?.is_staff) redirect("/portal/dashboard");

  return <StaffHub staffEmail={user.email ?? ""} />;
}

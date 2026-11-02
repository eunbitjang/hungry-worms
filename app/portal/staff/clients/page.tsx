import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getClientSettings } from "@/lib/staff/client-settings";
import ClientSettingsEditor from "./ClientSettingsEditor";

export const metadata: Metadata = {
  title: "Clients & Bins · Staff",
};

export default async function ClientSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal?next=/portal/staff/clients");

  const { data: profile } = await supabase.from("profiles").select("is_staff").eq("id", user.id).single();
  if (!profile?.is_staff) redirect("/portal/dashboard");

  // ?client=<id> (from the pickup form's "Change them" link) opens that client straight away.
  const { client } = await searchParams;

  return (
    <ClientSettingsEditor
      staffEmail={user.email ?? ""}
      initial={await getClientSettings()}
      openId={typeof client === "string" ? client : ""}
    />
  );
}

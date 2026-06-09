import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type WasteRow = {
  id: string;
  pickup_date: string;
  location_site: string | null;
  waste_type: string | null;
  bin_number: string | null;
  weight_kg: number;
  co2e_kg: number;
  car_equiv_year: number;
  car_equiv_month: number;
};

export type PortalData = {
  clientName: string;
  contactName: string;
  userEmail: string;
  rows: WasteRow[];
  firstPickupDate: string | null;
};

/**
 * Fetches all data needed for the portal dashboard.
 * Must be called from a Server Component.
 * Redirects to /portal if unauthenticated or not an authorised client.
 */
export async function getPortalData(): Promise<PortalData> {
  const supabase = await createClient();

  // 1. Verify auth
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) redirect("/portal");

  // 2. Get profile (client_id mapping)
  const { data: profile } = await supabase
    .from("profiles")
    .select("client_id, contact_name, is_staff")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Logged in but not yet provisioned — show pending state
    return {
      clientName: "",
      contactName: user.email ?? "",
      userEmail: user.email ?? "",
      rows: [],
      firstPickupDate: null,
    };
  }

  // 3. Get client name
  const { data: client } = await supabase
    .from("clients")
    .select("name")
    .eq("id", profile.client_id)
    .single();

  // 4. Get waste log rows — always filter by client_id explicitly (RLS is a safety net, not the primary filter)
  const { data: rawRows } = await supabase
    .from("waste_log")
    .select(
      "id, pickup_date, location_site, waste_type, bin_number, weight_kg, co2e_kg, car_equiv_year, car_equiv_month"
    )
    .eq("client_id", profile.client_id)
    .order("pickup_date", { ascending: true });

  const rows: WasteRow[] = (rawRows ?? []).map((r) => ({
    id: r.id,
    pickup_date: r.pickup_date,
    location_site: r.location_site,
    waste_type: r.waste_type,
    bin_number: r.bin_number,
    weight_kg: Number(r.weight_kg),
    co2e_kg: Number(r.co2e_kg),
    car_equiv_year: Number(r.car_equiv_year),
    car_equiv_month: Number(r.car_equiv_month),
  }));

  return {
    clientName: client?.name ?? "Your Organisation",
    contactName: profile.contact_name ?? user.email ?? "",
    userEmail: user.email ?? "",
    rows,
    firstPickupDate: rows[0]?.pickup_date ?? null,
  };
}

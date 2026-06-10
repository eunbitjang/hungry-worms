import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type StaffWasteRow = {
  id: string;
  clientId: string;
  clientName: string;
  pickup_date: string;
  location_site: string | null;
  waste_type: string | null;
  bin_number: string | null;
  weight_kg: number;
  co2e_kg: number;
  car_equiv_year: number;
};

export type StaffOverviewData = {
  userEmail: string;
  rows: StaffWasteRow[];
  totalClients: number;
};

/**
 * All-clients impact data for the staff overview. Verifies the caller is staff,
 * then reads every client's rows via the admin client (RLS already grants staff
 * full read, but the explicit is_staff check + admin read keeps it unambiguous).
 * Must be called from a Server Component.
 */
export async function getStaffOverview(): Promise<StaffOverviewData> {
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

  const admin = createAdminClient();

  const { data: clientsRaw } = await admin.from("clients").select("id, name");
  const nameById = new Map<string, string>((clientsRaw ?? []).map((c) => [c.id, c.name]));

  // Paginate — total rows exceed Supabase's default 1000-row response cap.
  const rows: StaffWasteRow[] = [];
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await admin
      .from("waste_log")
      .select(
        "id, client_id, pickup_date, location_site, waste_type, bin_number, weight_kg, co2e_kg, car_equiv_year"
      )
      .order("pickup_date", { ascending: false })
      .range(from, from + pageSize - 1);

    if (error || !data || data.length === 0) break;
    for (const r of data) {
      rows.push({
        id: r.id,
        clientId: r.client_id,
        clientName: nameById.get(r.client_id) ?? "Unknown client",
        pickup_date: r.pickup_date,
        location_site: r.location_site,
        waste_type: r.waste_type,
        bin_number: r.bin_number,
        weight_kg: Number(r.weight_kg),
        co2e_kg: Number(r.co2e_kg),
        car_equiv_year: Number(r.car_equiv_year),
      });
    }
    if (data.length < pageSize) break;
  }

  return {
    userEmail: user.email ?? "",
    rows,
    totalClients: (clientsRaw ?? []).length,
  };
}

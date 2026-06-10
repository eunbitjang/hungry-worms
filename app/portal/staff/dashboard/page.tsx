import { getStaffOverview } from "@/lib/data/staff-overview";
import StaffOverview from "../StaffOverview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Clients · Impact Overview | Hungry Worms Staff",
};

export default async function StaffDashboardPage() {
  const data = await getStaffOverview();
  return <StaffOverview data={data} />;
}

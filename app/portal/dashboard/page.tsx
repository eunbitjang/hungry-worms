import { getPortalData } from "@/lib/data/portal";
import PortalDashboard from "./PortalDashboard";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Impact Dashboard | Hungry Worms Portal",
};

export default async function DashboardPage() {
  const data = await getPortalData();

  // Staff with no client of their own → straight to the all-clients overview.
  if (!data.clientName && data.isStaff) redirect("/portal/staff");

  // Not yet provisioned
  if (!data.clientName) {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="text-5xl mb-4">⏳</div>
          <h1 className="font-display text-2xl font-extrabold text-green-deep mb-3">
            Access pending
          </h1>
          <p className="text-soil/70 leading-relaxed">
            Your account (<strong>{data.userEmail}</strong>) hasn&apos;t been linked to a client
            organisation yet. Contact Hungry Worms at{" "}
            <a href="mailto:info@hungryworms.nz" className="text-green-primary hover:underline">
              info@hungryworms.nz
            </a>{" "}
            to get set up.
          </p>
        </div>
      </div>
    );
  }

  return <PortalDashboard data={data} />;
}

import { NextResponse } from "next/server";
import { getClientSettings } from "@/lib/staff/client-settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Report logos staff set on /portal/staff/clients, read by the Impact Report
 * Generator (a separate Cloudflare app) — hence the open CORS header. Logos are
 * public images already, so only client names and logo links are returned.
 */
export async function GET() {
  const { clients } = await getClientSettings();
  const logos = clients
    .filter((c) => c.logoUrl)
    .map((c) => ({ label: c.label, store: c.store, logoUrl: c.logoUrl }));
  return NextResponse.json(
    { logos },
    { headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" } }
  );
}

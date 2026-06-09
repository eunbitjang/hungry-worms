import { NextResponse } from "next/server";
import { syncSheetsToSupabase } from "@/lib/sheets/sync";

/**
 * Sheets → Supabase sync endpoint.
 *
 * GET  — called by Vercel Cron every 15 min (authenticated via CRON_SECRET header)
 * POST — manual trigger (authenticated via x-sync-token header)
 *
 * ⚠️  Set SYNC_SECRET in .env.local (any random string).
 *     Vercel Cron automatically sends Authorization: Bearer <CRON_SECRET>.
 */

function isAuthorized(request: Request): boolean {
  const syncSecret = process.env.SYNC_SECRET ?? "";
  if (!syncSecret) return true; // no secret set → allow (dev only)

  // Vercel Cron sends: Authorization: Bearer <CRON_SECRET>
  const authHeader = request.headers.get("authorization") ?? "";
  if (authHeader === `Bearer ${syncSecret}`) return true;

  // Manual POST trigger
  const tokenHeader = request.headers.get("x-sync-token") ?? "";
  if (tokenHeader === syncSecret) return true;

  return false;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return runSync();
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return runSync();
}

async function runSync() {
  try {
    const result = await syncSheetsToSupabase();
    console.log(`[sync] ✓ ${result.synced} rows synced, ${result.skipped} skipped`);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[sync] ✗ Error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

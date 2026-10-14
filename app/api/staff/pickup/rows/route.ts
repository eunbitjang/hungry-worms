import { NextResponse, after } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { EDIT_OPTIONS } from "@/lib/staff/pickup-config";
import {
  listAppPickups,
  updateAppPickupRow,
  deleteAppPickupRow,
  MissingSheetsCredentialsError,
  RowChangedError,
} from "@/lib/sheets/pickup";
import { syncSheetsToSupabase } from "@/lib/sheets/sync";

export const runtime = "nodejs";

/**
 * Fix-a-pickup API: list recent `App Pickups` rows, edit one, or delete one.
 *
 * Unlike logging a pickup (open, so field staff never hit a sign-in wall),
 * changing or removing saved data needs a signed-in staff account — otherwise
 * anyone with the URL could rewrite a client's impact history.
 */
async function requireStaff(): Promise<NextResponse | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in to fix a pickup." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("is_staff").eq("id", user.id).single();
  if (!profile?.is_staff) return NextResponse.json({ error: "Staff access only." }, { status: 403 });
  return null;
}

function sheetError(err: unknown) {
  if (err instanceof RowChangedError) return NextResponse.json({ error: err.message }, { status: 409 });
  if (err instanceof MissingSheetsCredentialsError) {
    return NextResponse.json(
      { error: "Server isn't configured to edit pickups yet. Please contact the site admin." },
      { status: 503 }
    );
  }
  console.error("[pickup rows] sheet write failed:", err);
  return NextResponse.json({ error: "Couldn't update the sheet. Please try again." }, { status: 502 });
}

/** Same post-write refresh as logging a pickup: let the Master Log recompute, then sync. */
function syncSoon() {
  after(async () => {
    try {
      await new Promise((r) => setTimeout(r, 12000));
      await syncSheetsToSupabase();
      revalidatePath("/");
    } catch (e) {
      console.error("[pickup rows] post-write sync failed (will catch up on next sync):", e);
    }
  });
}

function isExpected(x: unknown): x is string[] {
  return Array.isArray(x) && x.length === 8 && x.every((v) => typeof v === "string");
}

export async function GET() {
  const denied = await requireStaff();
  if (denied) return denied;
  try {
    return NextResponse.json({ rows: await listAppPickups() });
  } catch (err) {
    return sheetError(err);
  }
}

export async function PATCH(req: Request) {
  const denied = await requireStaff();
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { row, expected } = body;
  if (typeof row !== "number" || !isExpected(expected)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Old values (A–H) — a field may always keep the value it already had, even if
  // it predates the current form config; anything new must be a canonical option.
  const [, , oldClient, oldLocation, oldWaste, oldBin] = expected;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const client = str(body.client);
  const opts = EDIT_OPTIONS[client];
  if (!opts && client !== oldClient) return NextResponse.json({ error: "Unknown client" }, { status: 400 });

  const pick = (value: string, allowed: string[] | undefined, old: string, required: boolean) => {
    if (value === old && (value || !required)) return true;
    if (!value) return !required && (!allowed || allowed.length === 0);
    return !!allowed?.includes(value);
  };
  const wasteType = str(body.wasteType);
  const location = str(body.location);
  const binNumber = str(body.binNumber);
  if (!pick(wasteType, opts?.waste, oldWaste, true)) {
    return NextResponse.json({ error: "Choose a waste type for this client." }, { status: 400 });
  }
  if (!pick(location, opts?.location, oldLocation, (opts?.location.length ?? 0) > 0)) {
    return NextResponse.json({ error: "Choose a location for this client." }, { status: 400 });
  }
  if (!pick(binNumber, opts?.bin, oldBin, (opts?.bin.length ?? 0) > 0)) {
    return NextResponse.json({ error: "Choose a bin size for this client." }, { status: 400 });
  }

  const kg = Number(body.kg);
  if (!Number.isFinite(kg) || kg <= 0 || kg > 1000) {
    return NextResponse.json({ error: "Weight must be between 0 and 1000 kg." }, { status: 400 });
  }

  const m = str(body.pickupDate).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const d = m ? new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00Z`) : null;
  if (!m || !d || isNaN(d.getTime()) || d.getUTCDate() !== Number(m[3])) {
    return NextResponse.json({ error: "Invalid pickup date." }, { status: 400 });
  }

  try {
    await updateAppPickupRow(row, expected, {
      pickupDate: `${m[3]}/${m[2]}/${m[1]}`,
      client,
      location,
      wasteType,
      binNumber,
      weightKg: Math.round(kg * 100) / 100,
      notes: str(body.notes).slice(0, 500),
    });
  } catch (err) {
    return sheetError(err);
  }
  syncSoon();
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const denied = await requireStaff();
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (typeof body.row !== "number" || !isExpected(body.expected)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    await deleteAppPickupRow(body.row, body.expected);
  } catch (err) {
    return sheetError(err);
  }
  syncSoon();
  return NextResponse.json({ ok: true });
}

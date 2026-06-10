import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PICKUP_CLIENTS } from "@/lib/staff/pickup-config";
import { appendPickupRows, type CanonicalRow } from "@/lib/sheets/pickup";

export const runtime = "nodejs";

/** Date/time parts in NZ local time, regardless of server timezone. */
function nzParts(): Record<string, string> {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Pacific/Auckland",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  return Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
}

function nzTimestamp(): string {
  const p = nzParts();
  return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}:${p.second}`;
}

/** Accept "YYYY-MM-DD" from the date input → "DD/MM/YYYY"; default to NZ today. */
function resolvePickupDate(input: unknown): string {
  if (typeof input === "string") {
    const m = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  }
  const p = nzParts();
  return `${p.day}/${p.month}/${p.year}`;
}

type Entry = {
  boxIndex?: number;
  kg?: number | string;
  waste?: string;
  location?: string;
  capacity?: string;
};

export async function POST(req: Request) {
  // ── Auth: must be a logged-in staff member ───────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_staff")
    .eq("id", user.id)
    .single();
  if (!profile?.is_staff) {
    return NextResponse.json({ error: "Staff access required" }, { status: 403 });
  }

  // ── Parse + validate payload against the canonical config ─────────────────
  let body: { client?: string; pickupDate?: unknown; notes?: unknown; entries?: Entry[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const cfg = body.client ? PICKUP_CLIENTS[body.client] : undefined;
  if (!cfg) return NextResponse.json({ error: "Unknown client" }, { status: 400 });
  if (!Array.isArray(body.entries) || body.entries.length === 0) {
    return NextResponse.json({ error: "No pickup entries provided" }, { status: 400 });
  }

  const timestamp = nzTimestamp();
  const pickupDate = resolvePickupDate(body.pickupDate);
  const storeName = cfg.store ?? body.client!;
  const notes = typeof body.notes === "string" ? body.notes.trim() : "";

  const rows: CanonicalRow[] = [];
  for (const e of body.entries) {
    const box = typeof e.boxIndex === "number" ? cfg.boxes[e.boxIndex] : undefined;
    const kg = Number(e.kg);
    if (!box || !Number.isFinite(kg) || kg <= 0 || kg > 1000) continue;

    let wasteType = box.waste ?? "";
    let location = "";
    let binNumber = "";

    if (box.wasteOptions) {
      if (!box.wasteOptions.includes(e.waste as string)) continue;
      wasteType = e.waste as string;
    }
    if (box.locationOptions) {
      if (!box.locationOptions.includes(e.location as string)) continue;
      location = e.location as string;
    }
    if (box.capacityOptions) {
      if (!box.capacityOptions.includes(e.capacity as string)) continue;
      binNumber = e.capacity as string;
    }
    if (!wasteType) continue; // safety — every row needs a Waste Type

    rows.push({
      timestamp,
      pickupDate,
      client: storeName,
      location,
      wasteType,
      binNumber,
      weightKg: Math.round(kg * 100) / 100,
      notes,
    });
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: "No valid weights to save" }, { status: 400 });
  }

  // ── Write to the sheet ────────────────────────────────────────────────────
  try {
    await appendPickupRows(rows);
  } catch (err) {
    console.error("App Pickups append failed:", err);
    return NextResponse.json(
      { error: "Couldn't save to the sheet. Check the service account has edit access." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    saved: rows.length,
    client: storeName,
    pickupDate,
    totalKg: Math.round(rows.reduce((s, r) => s + r.weightKg, 0) * 10) / 10,
  });
}

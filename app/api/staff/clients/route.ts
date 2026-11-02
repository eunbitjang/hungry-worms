import { NextResponse } from "next/server";
import { cleanClient } from "@/lib/staff/pickup-config";
import { getClientSettings, saveClient, SettingsChangedError } from "@/lib/staff/client-settings";
import { requireStaff } from "@/lib/staff/require-staff";

export const runtime = "nodejs";

/**
 * Client settings for the pickup form: which clients appear, their boxes and
 * choices, notes and report logos. Changing them needs a signed-in staff
 * account, like fixing a pickup — the open pickup form validates against them.
 */
export async function GET() {
  const { denied } = await requireStaff("change client settings");
  if (denied) return denied;
  return NextResponse.json(await getClientSettings());
}

export async function PUT(req: Request) {
  const auth = await requireStaff("change client settings");
  if (auth.denied) return auth.denied;

  let body: { client?: unknown; expectedUpdatedAt?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const raw = (body.client ?? {}) as { id?: unknown };
  const expected = typeof body.expectedUpdatedAt === "string" ? body.expectedUpdatedAt : "";

  const { clients } = await getClientSettings();
  const existing = typeof raw.id === "string" ? clients.find((c) => c.id === raw.id) : undefined;
  if (typeof raw.id === "string" && raw.id && !existing) {
    return NextResponse.json({ error: "That client no longer exists. Reload the page." }, { status: 409 });
  }

  const client = cleanClient(raw, existing);
  if (typeof client === "string") return NextResponse.json({ error: client }, { status: 400 });

  // A new client must never replace an existing one, so compare against all of them.
  const others = existing ? clients.filter((c) => c.id !== existing.id) : clients;
  const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
  if (others.some((c) => same(c.label, client.label))) {
    return NextResponse.json({ error: "Another client already uses that name in the list." }, { status: 400 });
  }
  if (!existing && others.some((c) => same(c.store, client.store))) {
    return NextResponse.json({ error: "Another client already uses that sheet name." }, { status: 400 });
  }
  if (!existing) {
    const base = client.id;
    for (let n = 2; clients.some((c) => c.id === client.id); n++) client.id = `${base}-${n}`;
  }

  try {
    const settings = await saveClient(client, expected, auth.email);
    return NextResponse.json({ ok: true, settings });
  } catch (err) {
    if (err instanceof SettingsChangedError) return NextResponse.json({ error: err.message }, { status: 409 });
    console.error("[client settings] save failed:", err);
    return NextResponse.json({ error: "Couldn't save the settings. Please try again." }, { status: 502 });
  }
}

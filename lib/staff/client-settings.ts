import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { createAdminClient } from "@/lib/supabase/server";
import { DEFAULT_CLIENT_SETTINGS, type ClientSetting, type ClientSettings } from "./pickup-config";

/**
 * Where the staff-edited client settings live: one JSON file in a private
 * Supabase Storage bucket. No table or migration needed — the bucket is created
 * on the first save, and until then everyone gets DEFAULT_CLIENT_SETTINGS.
 *
 * Local testing: set PICKUP_SETTINGS_FILE=tmp/client-settings.json (gitignored)
 * to read/write a local file instead of touching the live bucket.
 */
const BUCKET = "staff-config";
const OBJECT = "client-settings.json";
const LOCAL_FILE = process.env.PICKUP_SETTINGS_FILE;

export class SettingsChangedError extends Error {
  constructor() {
    super("Someone else changed the client settings a moment ago. Reload the page and try again.");
    this.name = "SettingsChangedError";
  }
}

function parse(text: string): ClientSettings | null {
  try {
    const data = JSON.parse(text) as ClientSettings;
    return Array.isArray(data?.clients) && data.clients.length ? data : null;
  } catch {
    return null;
  }
}

async function readRaw(): Promise<ClientSettings | null> {
  if (LOCAL_FILE) {
    try {
      return parse(await readFile(path.resolve(LOCAL_FILE), "utf8"));
    } catch {
      return null;
    }
  }
  const { data, error } = await createAdminClient().storage.from(BUCKET).download(OBJECT);
  if (error || !data) return null; // no bucket / no file yet → defaults
  return parse(await data.text());
}

/** The current settings — never throws, falls back to the built-in defaults. */
export async function getClientSettings(): Promise<ClientSettings> {
  try {
    return (await readRaw()) ?? DEFAULT_CLIENT_SETTINGS;
  } catch (e) {
    console.error("[client-settings] read failed, using defaults:", e);
    return DEFAULT_CLIENT_SETTINGS;
  }
}

async function writeRaw(settings: ClientSettings): Promise<void> {
  const body = JSON.stringify(settings, null, 2);
  if (LOCAL_FILE) {
    const file = path.resolve(LOCAL_FILE);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, body, "utf8");
    return;
  }
  const storage = createAdminClient().storage;
  const upload = () =>
    storage.from(BUCKET).upload(OBJECT, body, { upsert: true, contentType: "application/json", cacheControl: "0" });
  let { error } = await upload();
  if (error && /bucket not found|not found/i.test(error.message)) {
    const created = await storage.createBucket(BUCKET, { public: false });
    if (created.error && !/already exists/i.test(created.error.message)) throw created.error;
    ({ error } = await upload());
  }
  if (error) throw error;
}

/**
 * Saves one client (new or edited). `expectedUpdatedAt` is the version the
 * editor loaded; if someone saved in between, nothing is written.
 */
export async function saveClient(
  client: ClientSetting,
  expectedUpdatedAt: string,
  by: string
): Promise<ClientSettings> {
  const current = await getClientSettings();
  if (current.updatedAt !== expectedUpdatedAt) throw new SettingsChangedError();
  const exists = current.clients.some((c) => c.id === client.id);
  const next: ClientSettings = {
    clients: exists ? current.clients.map((c) => (c.id === client.id ? client : c)) : [...current.clients, client],
    updatedAt: new Date().toISOString(),
    updatedBy: by,
  };
  await writeRaw(next);
  return next;
}

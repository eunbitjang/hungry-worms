/**
 * Per-client configuration for the staff "Log a Pickup" form.
 *
 * Data-driven so fields are easy to edit later. Each box = one optional kg input
 * that becomes exactly ONE canonical sheet row when filled — mirroring the
 * existing "one weight = one row" Master Log structure (see STAFF_PICKUP_FORM.md).
 *
 * The live settings are edited by staff on /portal/staff/clients and stored by
 * `lib/staff/client-settings.ts`; the defaults below are only used until the
 * first save. This file holds the types, defaults and pure helpers, so it is
 * safe to import from client components.
 *
 * Shared by the client form (rendering) AND the API routes (server-side
 * validation), so the canonical Waste Type / Location / capacity strings stay
 * authoritative and can never be spoofed from the browser.
 */

export type PickupBox = {
  /** Fixed Waste Type shown as a chip (no selector). */
  waste?: string;
  /** Waste Type selector → writes the chosen value to "Waste Type". */
  wasteOptions?: string[];
  /** Location selector → writes the chosen value to "Location / Site" (Russley). */
  locationOptions?: string[];
  /** Bin-capacity selector → writes the chosen value to "Bin Number" (Ballantynes). */
  capacityOptions?: string[];
};

export type PickupClientConfig = {
  /** Canonical Client name to store, when it differs from the display label. */
  store?: string;
  /** Optional note shown above the boxes (e.g. "not yet active"). */
  note?: string;
  boxes: PickupBox[];
};

/** One client as staff edit it. `id` never changes once created. */
export type ClientSetting = {
  id: string;
  /** Name shown in the "Select client" list. */
  label: string;
  /** Client name written to the sheet — fixed once pickups exist, or history splits. */
  store: string;
  note: string;
  /** false = hidden from "Log a pickup" (past pickups can still be fixed). */
  active: boolean;
  /** Logo image link used on the client's impact report. */
  logoUrl: string;
  boxes: PickupBox[];
};

export type ClientSettings = {
  clients: ClientSetting[];
  /** ISO time of the last save; "" while still on the built-in defaults. */
  updatedAt: string;
  updatedBy: string;
};

// Canonical Waste Type strings — use verbatim (see STAFF_PICKUP_FORM.md §"Canonical Waste Type strings").
const WASTE_SUDIMA = ["Restaurant / café waste", "Food prep waste"];
const WASTE_GREEN = ["Food waste", "Yard / green waste"];

function repeat<T>(count: number, make: () => T): T[] {
  return Array.from({ length: count }, make);
}

/** Built-in defaults: display label → config. Used until staff first save the settings. */
export const PICKUP_CLIENTS: Record<string, PickupClientConfig> = {
  "Sudima Christchurch Airport Hotel": {
    boxes: [
      ...repeat(6, () => ({ wasteOptions: WASTE_SUDIMA })),
      { waste: "Eggshells" },
      { waste: "Coffee grounds" },
    ],
  },
  "Sudima Christchurch City Hotel": {
    boxes: [
      ...repeat(5, () => ({ waste: "Food waste" })),
      { waste: "Eggshells" },
      { waste: "Coffee grounds" },
    ],
  },
  "The Russley Village": {
    boxes: repeat(4, () => ({
      waste: "Food waste",
      locationOptions: ["Main Kitchen", "Ashley Block"],
    })),
  },
  "Ballantynes Department Store Christchurch": {
    boxes: repeat(5, () => ({
      waste: "Food waste",
      capacityOptions: ["120L", "80L"],
    })),
  },
  "Willowbank Wildlife Reserve": {
    boxes: repeat(4, () => ({ wasteOptions: WASTE_GREEN })),
  },
  "Mitre 10 MEGA Papanui": {
    boxes: repeat(3, () => ({ wasteOptions: WASTE_GREEN })),
  },
  // Display "Scenic Hotel Cotswold" but store the canonical historical name.
  "Scenic Hotel Cotswold": {
    store: "Cotswold Scenic Circle Hotel",
    boxes: repeat(3, () => ({ waste: "Food waste" })),
  },
  "Orana Wildlife Park": {
    note: "Not yet active · same layout as Willowbank",
    boxes: repeat(4, () => ({ wasteOptions: WASTE_GREEN })),
  },
  // Office pickup, Durham St North. Bin count not confirmed yet, so this uses
  // the smallest existing layout; leave unused boxes empty.
  "BCN Architects": {
    note: "New client · bin count to confirm",
    boxes: repeat(3, () => ({ waste: "Food waste" })),
  },
};

/** Logos the impact report generator already ships with; staff can override them. */
const DEFAULT_LOGOS: Record<string, string> = {
  "BCN Architects": "https://www.bcn.net.nz/logo.svg",
};

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const DEFAULT_CLIENT_SETTINGS: ClientSettings = {
  clients: Object.entries(PICKUP_CLIENTS).map(([label, cfg]) => ({
    id: slugify(label),
    label,
    store: cfg.store ?? label,
    note: cfg.note ?? "",
    active: true,
    logoUrl: DEFAULT_LOGOS[label] ?? "",
    boxes: cfg.boxes,
  })),
  updatedAt: "",
  updatedBy: "",
};

/** What a saved row may be changed to, per client — used when fixing a pickup. */
export type EditOptions = { waste: string[]; location: string[]; bin: string[] };

const uniq = (xs: (string | undefined)[]) => [...new Set(xs.filter((x): x is string => !!x))];

/**
 * Keyed by the client name as it is STORED in the sheet, since that is what an
 * existing row carries. Merges every box's options, because a saved row no
 * longer knows which box it came from. Hidden clients are included so their
 * past pickups can still be fixed.
 */
export function buildEditOptions(clients: ClientSetting[]): Record<string, EditOptions> {
  return Object.fromEntries(
    clients.map((c) => [
      c.store,
      {
        waste: uniq(c.boxes.flatMap((b) => [b.waste, ...(b.wasteOptions ?? [])])),
        location: uniq(c.boxes.flatMap((b) => b.locationOptions ?? [])),
        bin: uniq(c.boxes.flatMap((b) => b.capacityOptions ?? [])),
      },
    ])
  );
}

/* ── Validation (shared by the settings API and the editor) ─────────────────── */

export const LIMITS = { label: 60, note: 140, option: 60, options: 10, boxes: 20, logo: 500 } as const;

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

function cleanList(v: unknown): string[] | null {
  if (!Array.isArray(v)) return null;
  const out = uniq(v.map((x) => clean(x, LIMITS.option)));
  return out.length ? out.slice(0, LIMITS.options) : null;
}

/**
 * Turns untrusted input into a valid box, or explains what is wrong. A box has
 * either several waste types (shown as a choice), or one waste type plus at most
 * one extra choice (location or bin size) — the form can only show one selector.
 */
function cleanBox(raw: unknown, n: number): PickupBox | string {
  const b = (raw ?? {}) as Record<string, unknown>;
  const waste = cleanList(b.wasteOptions ?? (b.waste ? [b.waste] : []));
  if (!waste) return `Box ${n} needs a waste type.`;
  const location = b.locationOptions === undefined ? null : cleanList(b.locationOptions);
  const capacity = b.capacityOptions === undefined ? null : cleanList(b.capacityOptions);
  if (b.locationOptions !== undefined && !location) return `Box ${n}: add at least one location, or switch the extra choice off.`;
  if (b.capacityOptions !== undefined && !capacity) return `Box ${n}: add at least one bin size, or switch the extra choice off.`;
  if (location && capacity) return `Box ${n} can ask for a location or a bin size, not both.`;
  if (waste.length > 1 && (location || capacity)) {
    return `Box ${n}: with more than one waste type, the box can't also ask for a location or bin size.`;
  }
  const box: PickupBox = waste.length > 1 ? { wasteOptions: waste } : { waste: waste[0] };
  if (location) box.locationOptions = location;
  if (capacity) box.capacityOptions = capacity;
  return box;
}

/** Validates one client from the editor. `existing` is the saved version, if any. */
export function cleanClient(raw: unknown, existing: ClientSetting | undefined): ClientSetting | string {
  const c = (raw ?? {}) as Record<string, unknown>;
  const label = clean(c.label, LIMITS.label);
  if (!label) return "Give the client a name.";
  // The sheet name can't change after creation: pickups already carry it.
  const store = existing ? existing.store : clean(c.store, LIMITS.label) || label;
  const logoUrl = clean(c.logoUrl, LIMITS.logo);
  if (logoUrl && !/^https:\/\/\S+$/i.test(logoUrl)) return "The logo link must start with https://";
  if (!Array.isArray(c.boxes) || c.boxes.length === 0) return "Add at least one box.";
  if (c.boxes.length > LIMITS.boxes) return `A client can have at most ${LIMITS.boxes} boxes.`;
  const boxes: PickupBox[] = [];
  for (let i = 0; i < c.boxes.length; i++) {
    const box = cleanBox(c.boxes[i], i + 1);
    if (typeof box === "string") return box;
    boxes.push(box);
  }
  return {
    id: existing?.id ?? (slugify(label) || "client"),
    label,
    store,
    note: clean(c.note, LIMITS.note),
    active: c.active !== false,
    logoUrl,
    boxes,
  };
}

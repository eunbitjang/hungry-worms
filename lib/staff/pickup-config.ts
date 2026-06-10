/**
 * Per-client configuration for the staff "Log a Pickup" form.
 *
 * Data-driven so fields are easy to edit later (e.g. when Orana's real pickups
 * start). Each box = one optional kg input that becomes exactly ONE canonical
 * sheet row when filled — mirroring the existing "one weight = one row" Master
 * Log structure (see STAFF_PICKUP_FORM.md).
 *
 * Shared by the client form (rendering) AND the API route (server-side
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

// Canonical Waste Type strings — use verbatim (see STAFF_PICKUP_FORM.md §"Canonical Waste Type strings").
const WASTE_SUDIMA = ["Restaurant / café waste", "Food prep waste"];
const WASTE_GREEN = ["Food waste", "Yard / green waste"];

function repeat<T>(count: number, make: () => T): T[] {
  return Array.from({ length: count }, make);
}

/** Display label → config. The key is what staff pick in the dropdown. */
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
};

export const PICKUP_CLIENT_NAMES = Object.keys(PICKUP_CLIENTS);

# Staff pickup form — spec for Claude Code

A new **staff-only** page in the already-built Hungry Worms site that replaces the clunky Google Form.
Goal: Mark logs an entire client visit on **one screen** (all bins at once), instead of submitting the
Google Form once per bin. Must write to the Google Sheet **without breaking** the Master Log / Client View
mapping. Read DATA_AND_SHEET.md first for the canonical sheet structure and impact formulas.

## The golden rule (don't break the mapping)
The form is **one page** for UX, but on submit the app **writes one canonical row per filled kg box**
(empty boxes are skipped — every box is optional). This matches the existing "one weight = one row"
structure exactly, so Master Log, Client View, the live hero, and the client portal all keep working.

### Canonical row written for each filled kg box
Write rows whose columns **exactly mirror the `Form responses 1` tab** (cols A–H), in this order:

`Timestamp | Pickup Date | Client | Location / Site | Waste Type | Bin Number | Weight kg | Notes`

- **Timestamp** — auto, the moment of entry (date + time, NZ local).
- **Pickup Date** — defaults to **today** (auto-detected from the device); allow a **manual date override**
  for when Mark logs from a memo later. Date only (DD/MM/YYYY, NZ locale).
- **Client** — the canonical client name (see list below). Never write a display alias.
- **Location / Site** — only used by Russley (Main Kitchen / Ashley Block); blank otherwise.
- **Waste Type** — per box (see per-client config). Use the exact canonical strings below.
- **Bin Number** — **retired**; leave blank. **Exception: Ballantynes** stores bin capacity here ("120L"/"80L").
- **Weight kg** — the number entered in that box.
- **Notes** — the submission-level "special notes" field; write it on **each row of that submission**
  (so it survives sorting/filtering).
- **CO₂e avoided / Car-equivalent columns** — do **NOT** invent a different method. Let Master Log compute
  them the same way it already does for `Form responses 1` rows (×2.5, ÷4600). If the team's Master Log
  expects pre-computed values, compute them identically. Consistency with existing rows is the requirement.

### Where to write
- Append to a **dedicated tab `App Pickups`** that has the **same 8 columns as `Form responses 1`**.
  Do **not** write into the Google Form's own `Form responses 1` tab (the Form manages that tab's rows).
- Extend **Master Log** so it combines **`Form responses 1` + `Historical` + `App Pickups`** (same mechanism
  it already uses to combine the first two), with the same CO₂e/Car computation and newest-first ordering.
- The website's existing Supabase sync keeps reading Master Log → hero + portal unchanged.
- **Service account needs WRITE (edit) access** to the spreadsheet (currently read-only). The user will
  share the sheet with edit permission. Keep all sheet credentials server-side only.

## Canonical client names (dropdown display → value stored)
All store exactly as written **except Cotswold**:
- Sudima Christchurch Airport Hotel
- Sudima Christchurch City Hotel
- The Russley Village
- Ballantynes Department Store Christchurch
- Willowbank Wildlife Reserve
- Mitre 10 MEGA Papanui
- **"Scenic Hotel Cotswold" (display) → store `Cotswold Scenic Circle Hotel`** (matches all historical data)
- Orana Wildlife Park (new)

## Per-client form configuration
Build this as a **data-driven config object** (one entry per client) so fields are easy to edit later
(e.g., when Orana's real pickups start). Each "kg box" = one weight input that becomes one row when filled.

1. **Sudima Christchurch Airport Hotel** — 8 boxes:
   - 6 × kg box, each with a **Waste Type selector: [Restaurant / café waste | Food prep waste]**
   - 1 × kg box fixed Waste Type = **Eggshells**
   - 1 × kg box fixed Waste Type = **Coffee grounds**
2. **Sudima Christchurch City Hotel** — 7 boxes:
   - 5 × kg box, fixed Waste Type = **Food waste** (no selector — keep Mark's existing convention)
   - 1 × kg box = **Eggshells**
   - 1 × kg box = **Coffee grounds**
3. **The Russley Village** — 4 × kg box, Waste Type fixed **Food waste**, each with a
   **Location selector: [Main Kitchen | Ashley Block]** → writes to **Location / Site**.
4. **Ballantynes Department Store Christchurch** — 5 × kg box, Waste Type fixed **Food waste**, each with a
   **capacity selector: [120L | 80L]** → writes to **Bin Number** ("120L"/"80L").
5. **Willowbank Wildlife Reserve** — 4 × kg box, each with a
   **Waste Type selector: [Food waste | Yard / green waste]**.
6. **Mitre 10 MEGA Papanui** — 3 × kg box, each with a
   **Waste Type selector: [Food waste | Yard / green waste]** (keep "Yard / green waste", not "Green waste").
7. **Cotswold Scenic Circle Hotel** — 3 × kg box, Waste Type fixed **Food waste**.
8. **Orana Wildlife Park** (not yet active) — **clone Willowbank**: 4 × kg box, each with selector
   **[Food waste | Yard / green waste]**. Add to `Client Access` for portal login. Revisit field layout
   when real pickups begin (config-driven, so it's a quick edit).

### Canonical Waste Type strings (use verbatim)
`Food waste`, `Restaurant / café waste`, `Food prep waste`, `Eggshells`, `Coffee grounds`, `Yard / green waste`.

## UX requirements
- **UI language: English only** (the staff user, Mark, speaks English only). All labels, buttons, and messages in English.
- Pick **Client** first → reveal only that client's boxes/selectors.
- **Date + time auto-filled** from the device; a toggle/field to **manually set Pickup Date** if logging later.
- **All kg boxes optional** — some days extra bins are filled, some days assigned bins aren't. Submit with
  any subset; only filled boxes create rows. Block submit only if **zero** boxes are filled.
- **Live daily total**: as boxes are filled, show the **sum of all kg** for this pickup (display only — not a
  stored column).
- Numeric validation (kg ≥ 0, sensible max), one-tap selectors, large touch targets — Mark uses **phone /
  tablet / PC**, so it must be fully responsive and fast.
- Prevent duplicate submission (disable button after submit / idempotency) so a double-tap doesn't double-write.
- Success confirmation showing what was logged (client, date, # of bins, total kg) with an undo/edit hint.

## Access
- Staff-only route (behind the `is_staff` role from PROJECT_SPEC §8). Normal client logins must not see it.

## Why this can't break the mapping (recap for QA)
- Same 8-column structure as `Form responses 1`; only the **input UX** changed, not the stored shape.
- Client names are canonical (Cotswold normalised) → no client gets split.
- Waste Type strings match the historical set → "waste by type" charts stay coherent.
- Bin capacity reuses the now-free Bin Number column → no new columns, no formula changes.
- One submission → N canonical rows → Master Log / Client View / hero / portal all read it natively.

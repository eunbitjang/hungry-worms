# Data source & impact calculations

The new website's live numbers and the client portal both read from ONE Google Sheet that the team
already maintains (Mark logs each pickup via a Google Form → it lands in this sheet).

## The Google Sheet
- **Spreadsheet:** "Hungry Worms Waste Pick-Up Log (Responses)"
- **Spreadsheet ID:** `1PPRHB2glme4KDunrHLE-o4G_6InmAytJNsdb8bw3vuo`
- Tabs that matter:
  - **`Form responses 1`** — raw Google Form submissions (Mark's live data entry). Do not write to it.
  - **`Master Log`** — the combined, sorted master view (historical + live form), 11 columns. **This is the source of truth for all impact numbers.**
  - **`Client View`** — client-facing columns only (no Timestamp/Notes), one row per pickup line item, includes an `Access Email` column. Convenient pre-filtered view.
  - **`Client Access`** — mapping `Client | Contact name | Email`. One row per authorised person. Multiple rows allowed per client (for multiple staff).
  - `Historical` (static import), `Dashboard` (in-sheet summary) — reference only.

### Master Log columns (A–K)
`Timestamp | Pickup Date | Client | Location / Site | Waste Type | Bin Number | Weight kg | Notes | CO2e avoided (kg) | Car equivalent (1yr) | Car equivalent (1 month)`
- Data rows start at row 5 (rows 1–2 = KPI/filter bar, row 4 = header).
- `Pickup Date` is a real date (DD/MM/YYYY, NZ locale). `Weight kg`, `CO2e avoided`, `Car equivalent` are numbers.
- `Client` values are canonical names: `Willowbank Wildlife Reserve`, `The Russley Village`, `Sudima Christchurch City Hotel`, `Sudima Christchurch Airport Hotel`, `Ballantynes Department Store Christchurch`, `Cotswold Scenic Circle Hotel`, `Mitre 10 MEGA Papanui`.
- Data spans Mar 2023 → present and grows ~50–80 rows/month.

## Impact formulas (authoritative — keep identical everywhere)
- **CO₂e avoided (kg)** = `Weight kg × 2.5`  (1 kg food waste ≈ 2.5 kg CO₂e; matches the site's own stat)
- **Car equivalent (1 year)** = `CO₂e avoided ÷ 4600`  (one petrol car ≈ 4,600 kg CO₂e/yr — US EPA)
- **Car equivalent (1 month)** = `CO₂e avoided ÷ (4600 ÷ 12)` = `CO₂e × 12 ÷ 4600`

## Home Hero — the 3 live numbers (company-wide, all clients)
Compute from `Master Log` over ALL rows (all clients, all time):
- **Waste diverted (kg)** = `SUM(Weight kg)`
- **GHG avoided (kg CO₂e)** = `Waste diverted × 2.5`  (= `SUM(CO2e avoided (kg))`)
- **Cars off road (1 yr)** = `GHG avoided ÷ 4600`  (= `SUM(Car equivalent (1yr))`)

Display formatting: thousands separators; round Waste/GHG to whole kg, Cars to 1 decimal. Animate count-up on load is nice-to-have.

Freshness: read server-side and cache ~10 min (ISR/revalidate). These are public marketing numbers — fine to expose the aggregates (never expose raw per-client rows publicly).

## Client portal — per-client data (private, behind login)
- After login, map the user's email → client via the `Client Access` mapping (Email → Client).
- Show ONLY that client's rows. The per-client dashboard mirrors `DASHBOARD_DESIGN.md`:
  cumulative Waste/CO₂e/Cars, monthly trend, waste-by-type, collection log table, PDF/CSV export, date range.
- **Security:** all filtering happens server-side / via DB row-level security. Never send other clients'
  rows to the browser. The marketing hero (aggregate) is the only public number.

## How to read the sheet from code (recommended)
- Create a **Google Cloud service account**, enable the Google Sheets API, and **share the spreadsheet
  read-only** with the service account email. Store the service-account JSON in server env (never client).
- Recommended production pattern (see PROJECT_SPEC): a scheduled sync (every ~15 min) pulls `Master Log`
  into Supabase Postgres (`waste_log` table) so the site queries Postgres (fast + RLS), and the sheet
  stays the team's data-entry source of truth. The hero aggregate and portal both read from Postgres.
- Simpler fallback (no DB): read the sheet directly server-side via the Sheets API and filter in code.
  Works at this scale but weaker isolation — prefer the Supabase pattern.

## Client ↔ login mapping
- Keep the `Client Access` tab as the human-editable mapping; sync it into a `clients`/`profiles` table.
- One client may have several authorised emails (multiple staff). New client onboarding = add a row with
  their contact's email, then invite them.

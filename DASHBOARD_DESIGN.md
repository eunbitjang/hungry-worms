# Client portal dashboard — design reference

Each logged-in client sees ONLY their own organisation's data (RLS). The dashboard mirrors the monthly
impact PDF the team already sends, but live and self-service. Eco theme (greens), clean, flat, accessible.

## Layout (top → bottom)
1. **Header bar:** Hungry Worms logo + "Impact dashboard" + the client's name (e.g., "Sudima Christchurch Airport Hotel"). Right side: PDF + CSV download buttons. Account/sign-out menu.
2. **Period control:** This month / This year / Since start / Custom range. Drives all numbers below.
3. **KPI cards (for the selected period):**
   - Waste diverted (kg)
   - CO₂e avoided (kg)
   - Car-equivalent (1 yr) — and optionally (1 month)
   - Since-service-start total + number of pickups
4. **Narrative summary (auto-generated sentence):** e.g. "Since {start date}, you've diverted {X} kg of food & organic waste, avoiding {Y} kg CO₂e — like taking {Z} cars off the road for a year." Numbers come from the client's live data.
5. **Charts:**
   - Monthly waste recycled (bar/column)
   - Cumulative CO₂e avoided (area/line)
   - Waste by type (donut: Food waste / Restaurant·café / Eggshells / Coffee grounds / Yard·green)
   - (if multiple sites/bins) waste by site
6. **Collection log table:** Pickup Date · Location/Site · Waste Type · Bin Number · Weight kg · CO₂e — sortable, searchable; this is the appendix/detail. Export to CSV.
7. **Footer note:** "You're viewing only {Client} data. Updated live from Hungry Worms."

## Behaviour & rules
- All values use the impact formulas in DATA_AND_SHEET.md (×2.5, ÷4600).
- Downloads: one-click branded **PDF** of the report + **CSV** of the table.
- Per-client isolation enforced server-side / via DB RLS — never expose other clients' rows.
- Charts: Recharts (or similar). Round all displayed numbers. Mobile-responsive.

## Visual reference
A working HTML mockup of this exact dashboard (with real Sudima Airport sample numbers, eco-green theme,
KPI cards + monthly bar + cumulative area + waste-type donut + collection log) was produced in the Cowork
session. Reproduce that look: flat surfaces, green accents (#1D9E75 / #0F6E56), generous whitespace,
metric cards with a muted label + large number, custom legends, a leaf motif in the header.
A self-contained version is saved here as **`dashboard-mockup.html`** — open it in a browser; it's the
pixel/structure reference for the portal (reproduce in React + Recharts with the client's live data).

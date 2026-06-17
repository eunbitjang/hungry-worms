# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> ⚠️ This repo uses **Next.js 16** (App Router). Several conventions differ from older Next.js
> you may know — see AGENTS.md. The clearest example: **middleware lives in `proxy.ts`** (not
> `middleware.ts`) and exports a `proxy()` function. Read `node_modules/next/dist/docs/` before
> assuming an API exists.

## Commands

```bash
npm run dev      # local dev server (Turbopack) → http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint (eslint-config-next)
```

There is no test runner configured. The `scripts/*.mjs` files are **operational/admin scripts**,
not a test suite. Run them against the live Supabase project with env loaded from `.env.local`:

```bash
node --env-file=.env.local scripts/set-staff.mjs info@hungryworms.nz true   # grant staff access
node --env-file=.env.local scripts/verify-sheet-write.mjs                    # check sheet write access
node --env-file=.env.local scripts/e2e-supabase.mjs                          # end-to-end Supabase check
```

To manually trigger the Sheets→Supabase sync locally: `POST /api/sync` with header
`x-sync-token: <SYNC_SECRET>` (or just hit it with no `SYNC_SECRET` set in dev — auth is skipped).

## Architecture

This is the Hungry Worms marketing site **plus** a customer/staff portal, built on Next.js App
Router. There are two distinct surfaces in one app:

1. **Public marketing site** — `/`, `/about`, `/services`, `/process`, `/faq`, `/contact`, etc.
   Rendered with the `Header`/`Footer` chrome.
2. **Portal** — everything under `/portal`. Rendered **without** the marketing chrome.

`app/components/ConditionalShell.tsx` (a client component used in `app/layout.tsx`) is what decides
which: any path starting with `/portal` skips Header/Footer/ScrollToTop.

### The data pipeline (the core of this app)

Waste-pickup data originates in a **Google Sheet** (`Master Log` tab) and flows into Supabase, which
backs the portal dashboards and the public homepage scorecard:

```
Google Sheet "Master Log"  ──(read)──▶  /api/sync  ──(upsert)──▶  Supabase `waste_log`
   ▲                                                                      │
   │ append "App Pickups" tab                                  (read, filtered by client) │
   │                                                                      ▼
Staff "Log a Pickup" form ─POST▶ /api/staff/pickup            Portal dashboards + hero
```

- **`lib/sheets/sync.ts`** — reads `Master Log!A5:K`, parses NZ `DD/MM/YYYY` dates, maps client
  names → `clients.id` (auto-registering unknown clients), and upserts into `waste_log` keyed by a
  content-hash `external_id` (stable across sheet re-sorts). Rows not seen in a run are deleted, with
  a safety guard that skips the delete if the read looks partial (sheet mid-recompute).
- **`/api/sync`** runs on a **Vercel cron** (`vercel.json`, daily 20:00 UTC) and can be triggered
  manually. Cron auth = `Authorization: Bearer <SYNC_SECRET>`; manual = `x-sync-token: <SYNC_SECRET>`.
- **`/api/staff/pickup`** is the write path: staff submit weights, rows are validated server-side
  against `lib/staff/pickup-config.ts`, appended to a dedicated **`App Pickups`** sheet tab (never the
  Google Form's own response tab), then a sync is kicked off in the background via `after()` (with a
  ~12s delay so the Master Log's spilled formula recomputes first).

### Supabase clients — pick the right one (`lib/supabase/`)

- **`createClient()`** (`server.ts`) — SSR client that reads the session cookie; **RLS applies**. Use
  in Server Components and route handlers for user-scoped reads.
- **`createAdminClient()`** (`server.ts`) — service-role client that **bypasses RLS**. Server-only,
  for sync jobs and the all-clients staff overview. Never expose to the browser.
- **`client.ts`** — browser client for client components (auth flows).

Per-client data isolation is enforced two ways: always filter queries by `client_id` explicitly
*and* rely on RLS as a safety net (see `lib/data/portal.ts`).

### Auth & route protection

- `proxy.ts` (the middleware) refreshes the Supabase session and **redirects unauthenticated users**
  away from `/portal/dashboard/*` and `/portal/staff/*` to `/portal?next=...`.
- The middleware does **not** check roles. Per-route role checks (`profiles.is_staff`) live in the
  pages/handlers themselves (e.g. `/api/staff/pickup`, `lib/data/staff-overview.ts`).
- A logged-in user with no linked client sees an "access pending" state; staff with no client of
  their own are redirected from `/portal/dashboard` to `/portal/staff`.

### Config as shared source of truth

`lib/staff/pickup-config.ts` (`PICKUP_CLIENTS`) defines, per client, the pickup-form fields (boxes,
waste-type/location/capacity options). It is imported by **both** the client form (`PickupForm.tsx`,
for rendering) **and** the API route (for validation), so the canonical waste-type/location strings
written to the sheet can't be spoofed from the browser. Each filled "box" = exactly one sheet row.

### Other integrations

- **Contact form** (`/api/contact`) sends email via **Resend**. `FROM_EMAIL` is still the Resend
  sandbox sender — swap after DNS verification.
- **SEO**: site-wide JSON-LD `LocalBusiness` in `app/layout.tsx`; `app/sitemap.ts`, `app/robots.ts`,
  `app/opengraph-image.tsx`; old Wix→new URL 301 redirects in `next.config.ts`.

### Styling

Tailwind **v4**, configured in CSS via `@theme` in `app/globals.css` (no `tailwind.config.js`). Brand
palette and tokens (`--color-green-primary`, `--color-cta`, `--color-soil`, shadows, the
`text-gradient-leaf` helper) are defined there. Fonts: Inter (`--font-inter`) + Plus Jakarta Sans
(`--font-display`) via `next/font`.

## Environment variables

Set in `.env.local` (not committed). Required for full functionality:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase (public)
- `SUPABASE_SERVICE_ROLE_KEY` — admin/sync (server-only, RLS bypass)
- `GOOGLE_SHEET_ID`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY` — Sheets service account
  (store `\n` literally in the key; code restores real newlines)
- `SYNC_SECRET` — protects `/api/sync`
- `RESEND_API_KEY` — contact form email

---

# CLAUDE.md — start here

You're building a new **website + client portal** for **Hungry Worms** (Canterbury, NZ — full-circle
commercial food & green-waste recycling). This folder is a **handoff package** prepared in a separate
Claude Cowork session (memories are NOT shared between Cowork and Claude Code — these docs are the
shared context). Read them before writing code.

## Language / communication
Always reply to the user **in Korean** (the user is Korean). Keep all code, file names, comments,
commit messages, and these docs in **English**. Do not reply in Japanese or any other language.

## Read in this order
1. `PROJECT_SPEC.md` — goals, scope, tech stack (Next.js + Supabase + RLS), architecture, pages, CTAs, build phases, acceptance criteria, env vars.
2. `DATA_AND_SHEET.md` — the Google Sheet (Master Log), impact formulas (×2.5, ÷4600), the 3 live hero KPIs, per-client portal data + isolation.
3. `CURRENT_SITE_CONTENT.md` — all content from the existing hungryworms.nz (raw material to UPGRADE, not copy).
4. `CASE_STUDIES.md` — partner logos + the flagship Willowbank closed-loop story + Sudima proof/testimonial.
5. `BRAND.md` — voice, colours, typography, contact/social.
6. `DASHBOARD_DESIGN.md` — the per-client portal dashboard layout.
7. `STAFF_PICKUP_FORM.md` — staff-only "log a pickup" form that writes to the Google Sheet without breaking the Master Log / Client View mapping (one page → one canonical row per filled kg box).

## The essence (don't lose these)
- It's an **upgrade focused on converting prospective commercial clients**, not a 1:1 rebuild.
- **Home hero shows 3 LIVE numbers** from the Master Log sheet: Waste diverted, GHG avoided, Cars off road (company-wide).
- **Client login → per-client dashboard**, each sees ONLY their own data (Supabase RLS). PDF/CSV export.
- **Prominent partner logos**, **strong CTAs throughout**, and a clear **path to the Uncle Bob's shop (unclebobs.co.nz)**.
- Keep the Google Sheet as the team's data-entry source of truth; sync → Supabase Postgres for serving.

## Suggested first move
Confirm the stack with the user, scaffold the Next.js + Tailwind project here, set up the brand theme,
then build the marketing pages with upgraded copy (placeholder numbers first), and wire data + auth next.
Ask the user only for secrets/decisions flagged in PROJECT_SPEC §9 and §12 (service-account JSON,
Supabase/Resend keys, hosting, final logos).

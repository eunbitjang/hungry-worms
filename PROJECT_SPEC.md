# Hungry Worms — new website + client portal — PROJECT SPEC

> Read this first, then DATA_AND_SHEET.md, CURRENT_SITE_CONTENT.md, CASE_STUDIES.md, BRAND.md,
> DASHBOARD_DESIGN.md. Built in a Cowork session as a handoff to Claude Code (memories aren't shared —
> these docs are the shared brain). Ask the user only for secrets/decisions flagged below.

## 1. Goal & positioning
Build a NEW marketing website for **Hungry Worms** (Canterbury, NZ — full-circle commercial food &
green-waste recycling) plus a **client login portal** with per-client impact dashboards.

- This is an **upgrade, not a copy** of hungryworms.nz. Keep the substance of the current content but
  rewrite it to be **noticeably more compelling to prospective commercial clients** (ESG managers, GMs,
  ops/sustainability leads). Primary objective: make prospects **want to start a free trial / contact us**.
- Tone: warm, credible, locally-proud, business-practical (effortless, measurable, proven, closed-loop).
- B2B service is the hero of the site. Uncle Bob's (consumer garden products) stays a **separate** site
  (unclebobs.co.nz) — we link OUT to it, we do not rebuild its shop.

## 2. Scope
**In scope:** marketing site (Home, Services/Waste Collection, Our Process, About, Contact, legal pages),
live impact numbers in the Home hero, client auth, per-client dashboard, PDF/CSV export, deploy.
**Out of scope:** rebuilding Uncle Bob's ecommerce; changing the team's Google Form/Sheet workflow.

## 3. Tech stack (decided)
- **Next.js (App Router) + TypeScript + Tailwind CSS**; **Recharts** for charts.
- **Supabase** = Auth + Postgres + Row-Level Security (per-client isolation). (Chosen for cost + RLS + future.)
- **Resend** (free tier) for auth/magic-link emails (configure as Supabase custom SMTP).
- **Hosting:** Vercel (great Next.js DX; Hobby free to build, Pro $20/mo when commercial) OR Netlify/
  Cloudflare Pages (free, commercial-OK). Pick one at deploy; keep deploy config portable.
- **Data:** Google Sheets API (service account, read-only) → scheduled sync into Supabase Postgres.

## 4. Architecture
```
Google Sheet "Master Log" (team data entry via Google Form)
   │  scheduled sync (~15 min) via Sheets API service account
   ▼
Supabase Postgres:  waste_log, clients, profiles  (+ RLS)
   ▼
Next.js (Vercel/Netlify)
   ├─ Public marketing pages (SSG/ISR) + Home hero live aggregate (cache ~10 min)
   └─ /portal (auth required) → per-client dashboard via RLS
```
- **Hero numbers** = company-wide aggregate over all `waste_log` rows (see DATA_AND_SHEET.md → 3 KPIs).
- **Portal** = the authenticated user's client only, enforced by Supabase RLS (a user sees a row only if
  their client matches the mapping). Never ship other clients' rows to the browser.
- Keep the Google Sheet the single data-entry source of truth; Postgres is the fast/safe serving layer.

## 5. Home page (most important — conversion-focused)
Suggested section order (Claude Code may refine for impact):
1. **Hero:** strong value headline + subhead + primary CTA ("Start a free trial") + secondary ("See how it works"). Include the **3 live numbers** (Waste diverted, GHG avoided, Cars off road) with count-up animation. Slogan "Be part of the solution, not the pollution."
2. **Trusted-by logo strip:** prominent partner logos (Sudima, Mitre 10, Ryman Healthcare, Willowbank, Ballantynes, …). Clients are well-known — use this as a top trust signal.
3. **Our simple-as solution:** Collect → Recycle → Report (3 steps, icons).
4. **Flagship case study — Willowbank closed-loop** (full-circle visual; see CASE_STUDIES.md). Make it inspirational.
5. **Proven impact — Sudima** (fleet-offset stat + Rajas Patil testimonial).
6. **Why businesses choose us:** effortless, measurable (ESG reports), local/closed-loop, **free trial (99% continue)**.
7. **From waste to resource → Uncle Bob's:** short section showing the products their waste becomes, with a clear **path to the shop (unclebobs.co.nz)** — sells composting worms + organic fertilisers.
8. **Final CTA band:** "Ready to start your sustainability journey?" → free trial / contact.
- Live numbers must reconcile with the sheet; if the sync/data is unavailable, fall back to last-cached values (never show broken/zero).

## 6. Other pages (upgrade existing content from CURRENT_SITE_CONTENT.md)
- **Services / Waste Collection:** the 5-step how-it-works, tailored plans, **free trial**, additional services (on-site composter, machine leasing, fertiliser supply). Strong CTAs. This is the main sales page.
- **Our Process:** food→worms→plant food full-circle + the sustainability facts (4% of GHG; 2.5 kg CO₂/kg; methane 25× CO₂) with sources.
- **About:** mission/vision/approach + **Meet the team** (Mark Groufsky & Juline Grassam — Co-Founders; David Lim — Business Development; Ian Lamb — Head of Regenerative Farming; Mido Jang — Strategic Communications; Tim Lamb — Digital Marketing).
- **Contact:** form (name/email/phone/message) → emails the team (Resend) + success state; phone/email; map optional.
- **Legal:** Shipping & Returns, Privacy Policy, FAQ (carry over / refresh).

## 7. CTAs (place throughout)
- Primary repeated CTA: **"Start a free trial"** / **"Book a free consultation"** → contact form or Calendly-style.
- Secondary: "See how it works", "Get your impact report", "Talk to us".
- Header: persistent "Free trial" / "Contact" button. Footer: contact + social + Uncle Bob's shop.
- Uncle Bob's shop link in main nav AND in the "waste to resource" section AND footer.

## 8. Client portal
- `/portal` (or `/login`) — Supabase Auth (magic link or email+password). After login → per-client dashboard per DASHBOARD_DESIGN.md.
- Per-client isolation via RLS. PDF + CSV export. Mobile responsive.
- Admin/internal note: the team may want a "see all clients" internal view later — design the data model so an `is_staff` role can bypass client filter (don't block this, but client-isolation for normal users is the default and must be airtight).

## 9. Environment / secrets (ask the user when needed)
- `GOOGLE_SERVICE_ACCOUNT_JSON` (read-only Sheets access; share the spreadsheet with its email)
- `GOOGLE_SHEET_ID` = `1PPRHB2glme4KDunrHLE-o4G_6InmAytJNsdb8bw3vuo`
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` (auth emails)
- Hosting account (Vercel/Netlify). Domain `hungryworms.nz` (DNS later; user may move to .co.nz in future — make the email/base-URL a single config constant).

## 10. Build phases (suggested)
1. Scaffold Next.js + Tailwind + brand theme/tokens (BRAND.md); layout, header/footer, nav (incl. Uncle Bob's link).
2. Marketing pages with upgraded copy + sections (hero w/ placeholder numbers, logo strip, case studies, CTAs).
3. Supabase project + schema (`waste_log`, `clients`, `profiles`) + RLS policies.
4. Sheets→Supabase sync job (service account; cron). Wire Home hero to live aggregate (ISR).
5. Auth + `/portal` per-client dashboard (DASHBOARD_DESIGN.md) + PDF/CSV export.
6. Contact form (Resend), SEO/meta/OG, accessibility + performance pass, deploy + domain.

## 11. Acceptance criteria
- Home hero shows live company-wide Waste/GHG/Cars matching the Master Log totals (±cache lag).
- Partner logos visible near the top; Willowbank closed-loop case study present and compelling.
- Clear CTAs on every major section; Uncle Bob's shop reachable from nav, a home section, and footer.
- A client logs in and sees ONLY their organisation's data; can export PDF/CSV; cannot access others' data (verify RLS).
- Responsive, AA-accessible, good Lighthouse, per-page SEO meta. Copy reads as an upgraded, persuasive B2B site — not a copy of the old one.

## 12. Assets still needed from the team (Claude Code: ask/placeholder)
- Final logo (vector/PNG) + partner logos (with usage permission) + Uncle Bob's logo.
- Any preferred brand colours/fonts if they differ from BRAND.md suggestions.
- Hero/section photography.

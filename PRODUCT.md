# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Prospective commercial clients (primary).** ESG managers, general managers, and
operations/sustainability leads at Canterbury hotels, retail, aged care, and visitor
attractions. They are looking for a food-waste partner that onboards without disrupting
their kitchen and produces numbers they can put in an ESG or council report. They arrive
cold, evaluate quickly, and need proof before they will book anything.

**Worm and garden-product buyers (equally weighted, confirmed 2026-08-08).** Home
gardeners and small growers who want live composting worms, vermicast, or fertiliser.
They buy on the sister shop (unclebobs.co.nz), not here, so this site's job is to hand
them off cleanly. Product sales matter materially to cash flow, which is why this
audience now carries the same weight as B2B lead generation.

**Existing client contacts.** Named contacts at the seven onboarded client organisations,
logging in by magic link to see their own diverted weight, CO₂e, and pickup history, and
to export it. Client usage is expected to grow, and the client sees this reporting as the
clearest gap between Hungry Worms and competing waste operators.

**Internal field staff.** Mark and the team logging pickups from a phone, often on site.

## Product Purpose

Hungry Worms collects commercial food and green waste across Canterbury, vermicomposts
it, and sells the resulting products through its sister brand Uncle Bob's. This site is
both the sales asset for the collection service and the reporting surface for existing
clients.

Success has three shapes: a prospective client starts a free trial or makes contact; a
worm buyer reaches the Uncle Bob's shop; an existing client gets their own impact numbers
without emailing anyone.

## Positioning

The loop actually closes, and it can be shown. Willowbank Wildlife Reserve's food waste
returns to Willowbank as a retail product sold in their own gift shop — that is a new
revenue and brand story for the client, not just waste removal.

The second differentiator is verified per-client data. Every number on the site and in
the portal traces to an actual weighed pickup recorded by the team, not to an estimate or
an industry average. Competing operators do not put that in a client's hands.

## Operating Context

- The team's data entry stays in Google Sheets. Mark logs each pickup and it lands in the
  `Master Log` tab; that sheet is the source of truth and the workflow does not change to
  suit the website.
- A daily sync pulls `Master Log` into Supabase Postgres, which serves both the public
  hero totals and the portal.
- The staff "log a pickup" flow is deliberately public, with no login, so non-technical
  field staff can use it from a phone. This tradeoff was accepted knowingly. The
  all-clients staff dashboard stays login-protected.
- Client contacts log in with a magic link at `/portal`. Seven contacts were provisioned
  in June 2026 (Sudima Airport, Sudima City, Willowbank, Russley, Ballantynes, Mitre 10
  MEGA Papanui, Cotswold).
- Live at `www.hungryworms.nz` since the June 2026 migration off Wix. `hungryworms.nz`
  and both `.co.nz` variants 301 to it.
- Uncle Bob's is a separate shop on its own platform. This site links out to it with UTM
  tags so the handoff can be attributed; it is never rebuilt here.

## Capabilities and Constraints

- One Next.js app serves two surfaces: the public marketing site with the shared
  header/footer chrome, and `/portal` without it.
- Per-client isolation is enforced twice — an explicit `client_id` filter on every query
  plus Supabase row-level security as a backstop. No other client's rows may reach the
  browser. This is not negotiable.
- Impact formulas are fixed and must stay identical everywhere: CO₂e avoided = weight ×
  2.5; cars off the road for a year = CO₂e ÷ 4600.
- Public hero totals are company-wide aggregates only, cached about ten minutes. When the
  database is unreachable the site shows last-known fallback figures — never zero, never a
  broken state.
- The GitHub repository is public. No client contact details or other personal data may
  be committed.
- Contact-form mail sends from `info@hungryworms.co.nz` (the domain Resend could verify)
  and delivers to `info@hungryworms.nz`, with the enquirer as reply-to.
- Data spans March 2023 to present and grows roughly 50–80 rows a month.

## Brand Commitments

- Hungry Worms Ltd, Canterbury / Christchurch, Aotearoa New Zealand. Sister product brand:
  Uncle Bob's.
- Positioning line: "Be part of the solution, not the pollution."
- Voice is warm, optimistic, credible, locally proud, and business-practical. Sustainability
  led but written for someone with a budget and a reporting deadline.
- No greenwashing filler. Claims are backed by the live numbers or a cited source, or they
  do not appear.
- Phone 020 4184 1840 · info@hungryworms.nz · Instagram @unclebobsgardennz · Facebook
  /unclebobsgardencare.

## Evidence on Hand

Confirmed by the client as fact-checked and cleared for publication:

- **Partner logo usage** — Sudima Hotels, Mitre 10, Ryman Healthcare, Willowbank Wildlife
  Reserve, plus active clients Ballantynes, Cotswold Scenic Circle Hotel, The Russley
  Village, Mitre 10 MEGA Papanui.
- **99% of free-trial clients continue as long-term partners.**
- **Sudima** — since 2024, food-waste recycling across Sudima Christchurch City and
  Christchurch Airport has offset the greenhouse gas emissions of Sudima's entire South
  Island vehicle fleet. Testimonial from Rajas Patil, Hotel General Manager, Sudima
  Christchurch Airport, is approved for use.
- **Willowbank closed-loop story** — their waste returns to their own gift shop as product.

Also on hand:

- Live company-wide totals from `Master Log`, and per-client history from March 2023.
- Sustainability facts with sources: food and organic waste ≈ 4% of global GHG emissions
  (NZ Ministry for the Environment); >2.5 kg CO₂e per kg of food waste (UN FAO 2013 Food
  Wastage Footprint); methane 25× more potent than CO₂ (IPCC).
- Named team: Mark Groufsky and Juline Grassam (co-founders), David Lim (business
  development), Ian Lamb (regenerative farming), Mido Jang (strategic communications),
  Tim Lamb (digital marketing).

Not established — future work must not invent these: pricing or rate cards; any
testimonial other than Rajas Patil's; client counts or tonnage beyond what the sheet
returns; certifications, awards, or accreditations.

## Product Principles

1. **Every public number traces to a source.** Live sheet data or a cited study. If a
   claim cannot be sourced, it does not ship.
2. **Two conversion paths, one site.** A B2B trial enquiry and a worm purchase both count
   as success. Neither may be buried to make the other look cleaner.
3. **The portal is the moat.** Per-client verified reporting is what competitors cannot
   show; treat it as a sales asset, not an afterthought.
4. **The sheet is fixed; the product adapts.** The team's Google Form and Sheet workflow
   is a constraint to design around, not a thing to replace.
5. **Client data isolation is absolute.** Any change touching portal queries is a
   security change first and a design change second.

## Accessibility & Inclusion

WCAG 2.1 AA, mobile-first. Two concrete needs drive this: prospective clients evaluate on
phones, and field staff complete the pickup form outdoors on a phone, one-handed, in
daylight.

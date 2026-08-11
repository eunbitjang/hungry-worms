# Social assets

Instagram / Facebook carousel artwork, built from the same design system as the website
(see `DESIGN.md`, "Sunlit Soil") so a post and the site read as one brand.

Slides are authored as HTML at the exact publishing canvas and screenshotted with
Playwright. Nothing is drawn in a design tool, which means the figures on a slide can be
re-pulled from the live database and the whole set re-rendered in about ten seconds.

```
social/
  lib/slides.css          brand tokens + the 1080×1350 slide frame (shared by all posts)
  carousel-5-years.html   post 1 — "Five years" anniversary carousel (7 slides)
  caption-5-years.md      caption copy for IG / FB / LinkedIn, alt text, publish checklist
  refresh-figures.mjs     re-pull live totals from Supabase into the HTML
  render.mjs              screenshot every .slide in an HTML file to PNG
  comps/                  the three direction comps the carousel was chosen from
  out/                    rendered PNGs — these are what gets uploaded
```

## Rendering

```bash
node social/render.mjs social/carousel-5-years.html social/out/5-years
```

Every `<section class="slide" data-id="…">` becomes `out/<dir>/<data-id>.png` at its own
natural size. Upload them in filename order.

First run on a new machine needs the browser:

```bash
npm i -D playwright && npx playwright install chromium
```

## Refreshing the numbers before a repost

```bash
node --env-file=.env.local social/refresh-figures.mjs
node social/render.mjs social/carousel-5-years.html social/out/5-years
```

`refresh-figures.mjs` rewrites the figure constants and the printed figures in place, then
prints what it found. Two things it deliberately does **not** touch, so check them by eye
after a refresh:

- The headlines on slides 2 and 3 spell the tonnage out in words ("Seventy-two tonnes",
  "a hundred and eighty tonnes").
- Slide 1's `Five years · 3 Aug 2021 → 3 Aug 2026` chip is anniversary-specific.

## Canvas

1080 × 1350 (4:5). This is the largest portrait Instagram will show without cropping, and
Facebook accepts it unchanged. A 1:1 (1080 × 1080) variant can be added later by giving
`.slide` a square modifier in `lib/slides.css` — the layouts are flex columns and reflow,
but every slide would need re-checking, not just re-rendering.

## Rules that are not negotiable

- **Every figure traces to a weighed pickup.** No modelled or estimated numbers.
  CO₂e = weight × 2.5 (UN FAO 2013); cars = CO₂e ÷ 4,600 kg. Same formulas as the site.
- **Never round a figure up to look better**, and never present a company-age figure and a
  data-window figure as the same period. The company was registered 3 August 2021; the
  record starts 3 March 2023 — not because nothing was collected earlier, but because that
  is when the team started weighing and logging every pickup. Write "since we started
  keeping records", never "since our first pickup". Slides that show totals say so.
- **No per-client data, ever.** Client isolation applies to social exactly as it applies to
  the portal — aggregate totals only, never one client's weight or pickup count.
- **One orange.** Kiln Orange (`#E07A2F`) appears on the CTA of the final slide and
  nowhere else in a carousel.
- **Partner logos are used with permission.** The approved list lives in `PRODUCT.md`
  under "Evidence on Hand". Do not add a logo that is not on it.

## Known asset gaps

- `public/logos/willowbank.jpg` and `russley.jpeg` ship on an off-white ground rather than
  transparent. They are composited with `mix-blend-mode: multiply` and a small brightness
  lift, which is close but not perfect. Transparent PNG or SVG versions would be better.
- `cotswold.svg` carries a lot of built-in whitespace and is scaled up 1.85× to match the
  visual weight of the others.

## Type on a phone

The single most important constraint here, and the easiest to get wrong in an editor: a
1080px-wide image is displayed at roughly **390pt** on a phone, so everything on the canvas
arrives at about **0.36×**. A 22px caption reads as 7.9pt — unreadable. `lib/slides.css`
carries a canvas type scale keyed to that conversion, with nothing below 34px (≈12pt), and
the secondary tier is held at 4.5:1 contrast against both grounds because that is where the
citations, formulas and data windows live. Judge every size by its on-phone result, never
by how it looks at full canvas size.

Tracking is optical too. A `0.2em` uppercase label that works at 24px is far too loose at
42px and detaches the words from the figure above them; the big-number captions run at
`0.02em` with a wider gap instead.

## The brand mark

Every slide carries the real Hungry Worms emblem (`public/logos/hungry-worms.png`) on its
baseline at 88px, and **nothing beside it** — the mark already contains "HUNGRY WORMS LTD",
so a text wordmark next to it sets the name twice and squeezes the mark into a blob.

The file is green on an opaque white ground, so it is placed two different ways and neither
alters the asset:

- **On Paper slides** — `mix-blend-mode: multiply` drops the white out, and the mark sits
  directly on the page with no tile edge against `#F7F6F1`.
- **On Forest Floor slides** — a white rounded tile, the same card language as the partner
  logo tiles. The emblem cannot be reversed out to white without redrawing it.

If a transparent-background or white-on-transparent version of the emblem ever exists, the
dark-slide tile can go and the mark can sit straight on the green.

## Standing exceptions

The design detector (`.claude/skills/impeccable/scripts/detect.mjs`) will report these
every run. All are intentional; none is drift.

| Finding | Why it stays |
|---|---|
| `dark-glow` on `.pdot.open` | The lit "next slot" dot on slide 7. Client-approved 11 Aug 2026 over DESIGN.md's neon-glow ban — one 14px dot, and the halo is what lifts it out of 1,488 dimmed ones. |
| `overused-font` (Plus Jakarta Sans, Inter) | The brand's pinned faces, per DESIGN.md typography. Not a choice this post gets to make. |
| `design-system-font-size` | DESIGN.md's ramp is rem-based for a web viewport; this is a fixed 1080px canvas read at ~0.36×. See "Type on a phone". |
| `design-system-radius` (3px) | The tonne-block isotype glyphs are 44×30px data marks, not UI surfaces. The 0.5rem floor would round them into lozenges. |
| `design-system-color` (`#c9c7bf`, `rgba(0,0,0,0.28)`) | The HTML editor backdrop and comp-sheet shadow. `render.mjs` screenshots the `.slide` element, so neither can reach a PNG. |

# Logos

Drop real logo files here, then reference them in code.

## Hungry Worms logo
1. Add the file(s) here, e.g. `hungry-worms.svg` (dark, for white header) and
   `hungry-worms-white.svg` (white, for dark footer/portal).
2. Open `lib/brand.ts` and set:
   ```ts
   onLight: "/logos/hungry-worms.svg",
   onDark:  "/logos/hungry-worms-white.svg",
   ```
   (Set `width`/`height` to the logo's natural pixel ratio.)

## Partner / client logos
1. Add each file here, e.g. `sudima.svg`, `mitre10.svg`.
2. Open `app/page.tsx`, find the `PARTNERS` array, and add the `logo` path:
   ```ts
   { name: "Sudima Hotels", logo: "/logos/sudima.svg" },
   ```

## Formats
- **SVG preferred** — crisp at any size.
- Transparent **PNG** also fine (use @2x resolution, e.g. 240×72px).
- Keep partner logos a similar visual weight; the strip displays them ~36px tall.

## Email signature
`email-signature.png` — 240×240 transparent PNG, downscaled from `hungry-worms.png`.
Sized for a ~110px display in email clients (2× for retina). Served at
`https://www.hungryworms.nz/logos/email-signature.png`. Always set `width`/`height`
on the `<img>`; Outlook renders it at full size otherwise.

/**
 * Partner / client organisations, shared by the Home logo strip and the
 * Services "in good company" section.
 *
 * To show a real logo: drop the file into /public/logos/ and set `logo` to its
 * path. Entries without a `logo` render as a text chip, so you can add logos
 * one at a time without breaking the layout. SVG or transparent PNG works best.
 */
// `scale` enlarges a logo within its box — use it for marks that ship with a lot
// of built-in whitespace (e.g. stacked emblems) so they read at a comparable size.
// `url` links the logo out to the partner's site (sustainability page where available).
export type Partner = { name: string; logo?: string; scale?: number; url?: string };

export const PARTNERS: Partner[] = [
  { name: "Sudima Hotels", logo: "/logos/sudima.png", url: "https://www.sudimahotels.com/en/about-us/environment-social-governance/" },
  { name: "Mitre 10", logo: "/logos/mitre10.jpg", url: "https://www.mitre10.co.nz/sustainability" },
  { name: "Willowbank Wildlife Reserve", logo: "/logos/willowbank.jpg", url: "https://www.willowbank.co.nz/" },
  { name: "Ballantynes", logo: "/logos/ballantynes.png", url: "https://www.ballantynes.co.nz/" },
  { name: "Cotswold Scenic Circle", logo: "/logos/cotswold.svg", url: "https://www.scenichotelgroup.co.nz/christchurch/scenic-hotel-cotswold/" },
  { name: "The Russley Village", logo: "/logos/russley.jpeg", scale: 1.7, url: "https://www.russleyvillage.co.nz/about/sustainability" },
];

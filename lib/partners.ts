/**
 * Partner / client organisations, shared by the Home logo strip and the
 * Services "in good company" section.
 *
 * To show a real logo: drop the file into /public/logos/ and set `logo` to its
 * path. Entries without a `logo` render as a text chip, so you can add logos
 * one at a time without breaking the layout. SVG or transparent PNG works best.
 */
export type Partner = { name: string; logo?: string };

export const PARTNERS: Partner[] = [
  { name: "Sudima Hotels", logo: "/logos/sudima.png" },
  { name: "Mitre 10", logo: "/logos/mitre10.jpg" },
  { name: "Willowbank Wildlife Reserve", logo: "/logos/willowbank.jpg" },
  { name: "Ballantynes", logo: "/logos/ballantynes.png" },
  { name: "Cotswold Scenic Circle", logo: "/logos/cotswold.svg" },
  { name: "The Russley Village", logo: "/logos/russley.jpeg" },
];

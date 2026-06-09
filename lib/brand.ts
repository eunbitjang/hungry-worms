/**
 * Brand logo configuration.
 *
 * To use the real Hungry Worms logo:
 *   1. Drop the file(s) into  /public/logos/
 *   2. Set the path(s) below (start with a leading "/", e.g. "/logos/hungry-worms.svg")
 *   3. Save — the header, footer and portal pick it up automatically.
 *
 * Leave a value as `null` to keep the built-in worm-icon mark for that context.
 *
 * Tips:
 *   - SVG is best (crisp at any size). Transparent PNG also works.
 *   - Provide TWO versions because the logo sits on different backgrounds:
 *       onLight → header (white background)        → use the full-colour / dark logo
 *       onDark  → footer + portal (dark background) → use the white / reversed logo
 *   - If you only have one version, set both to the same path.
 */
export const BRAND_LOGO: {
  onLight: string | null;
  onDark: string | null;
  /** Natural aspect ratio of the logo file (used to reserve space without distortion). */
  width: number;
  height: number;
} = {
  onLight: null, // e.g. "/logos/hungry-worms.svg"
  onDark: null,  // e.g. "/logos/hungry-worms-white.svg"
  width: 170,
  height: 34,
};

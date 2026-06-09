/**
 * Brand logo configuration.
 *
 * The Hungry Worms logo is a square emblem (recycle triangle + worm + wordmark),
 * so we use it as a "mark" sitting beside a clean "Hungry Worms" wordmark — this
 * stays legible in the slim header/footer where the emblem's own text would be
 * too small to read.
 *
 *   mark     → square emblem file in /public/logos. Null → built-in worm-icon tile.
 *   wordmark → show the "Hungry Worms" text next to the mark.
 */
export const BRAND_LOGO: {
  mark: string | null;
  wordmark: boolean;
} = {
  mark: "/logos/hungry-worms.png",
  wordmark: true,
};

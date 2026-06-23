/**
 * Outbound links to our sister shop, Uncle Bob's Regenerative Garden
 * (unclebobs.co.nz) — the store where the products made from the waste we
 * recycle, including live composting worms, are actually sold.
 *
 * Centralised here so every "buy worms" entry point on the marketing site
 * (header, footer, announcement bar, floating button, /worms landing page)
 * points at the same deep links and stays in sync if the shop URLs change.
 *
 * The UTM tags let us attribute, in analytics, how much worm-buying traffic
 * Hungry Worms hands off to Uncle Bob's — the whole point of these entry points.
 */
const UNCLE_BOBS_ORIGIN = "https://www.unclebobs.co.nz";

function shopLink(path: string, campaign: string): string {
  const params = new URLSearchParams({
    utm_source: "hungryworms",
    utm_medium: "referral",
    utm_campaign: campaign,
  });
  return `${UNCLE_BOBS_ORIGIN}${path}?${params.toString()}`;
}

export const UNCLE_BOBS = {
  /** Shop homepage — used for general brand links. */
  home: `${UNCLE_BOBS_ORIGIN}/`,
  /** Full product listing — for "browse the range" CTAs. */
  shop: shopLink("/shop-all", "shop"),
  /** Live composting worms product page — for worm-buyer intent. */
  worms: shopLink("/shop-all/p/premium-composting-worms", "buy_worms"),
};

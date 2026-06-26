/**
 * The Library — a curated archive of press & explainer articles on the themes
 * behind our work: regenerative farming, natural farming, worm farming, food
 * security and the circular economy. The goal is educational: help visitors
 * understand the value and vision of what Hungry Worms does, in the words of
 * independent media and researchers.
 *
 * These are LINKS to external articles — we never republish full text. Each
 * entry carries our own short summary plus the original source and link.
 *
 * To add an article: append a new `LibraryArticle` and the page picks it up,
 * sorted newest-first. Topic/category filtering is intentionally NOT here yet —
 * once enough articles accumulate we'll analyse them and introduce categories.
 *
 * `region` is a light NZ/International label (not a filter). `date` is ISO
 * (YYYY-MM-DD); a few entries marked `approx` use the first of the month
 * because the source didn't expose an exact publication day — the page renders
 * dates as "Mon YYYY" so this reads honestly.
 */
export type LibraryArticle = {
  title: string;
  source: string;
  url: string;
  date: string; // ISO YYYY-MM-DD
  summary: string;
  region: "NZ" | "International";
  /** True when `date` is a best-estimate month (source had no exact day). */
  approxDate?: boolean;
};

const ARTICLES: LibraryArticle[] = [
  // ── New Zealand ──────────────────────────────────────────────────────────
  {
    title: "Inside Aotearoa's regenerative farming festival",
    source: "RNZ Country Life",
    url: "https://www.rnz.co.nz/news/country/588891/country-life-inside-aotearoa-s-regenerative-farming-festival",
    date: "2026-03-07",
    region: "NZ",
    summary:
      "The Underground Festival drew 400 farmers to Waipara for its second year, blending regenerative-farming education with community — a sign the movement is moving into the mainstream.",
  },
  {
    title: "Massey University highlights regenerative agriculture and bioeconomy innovation at Fieldays",
    source: "Rural News Group",
    url: "https://www.ruralnewsgroup.co.nz/rural-news/rural-general-news/massey-university-fieldays-2026-regenerative-farming",
    date: "2026-06-03",
    region: "NZ",
    summary:
      "Massey showcased Black Soldier Fly larvae that turn organic waste into nutrient-rich fertiliser, greenhouse-gas monitoring tech, and the seven-year Whenua Haumanu regenerative agriculture programme.",
  },
  {
    title: "Fonterra signs global regenerative agriculture declaration of intent",
    source: "Farmers Weekly",
    url: "https://www.farmersweekly.co.nz/news/fonterra-signs-global-regenerative-agriculture-declaration-of-intent/",
    date: "2026-05-22",
    region: "NZ",
    summary:
      "Fonterra joined Unilever, Danone and McCain in backing the SAI Platform's regenerative framework, noting many regenerative practices are already inherent in New Zealand's pasture-based farming.",
  },
  {
    title: "Look to land and sea for food security",
    source: "Newsroom",
    url: "https://newsroom.co.nz/2026/05/28/look-to-land-and-sea-for-food-security/",
    date: "2026-05-28",
    region: "NZ",
    summary:
      "A call to reduce reliance on imported staples and build domestic food resilience from New Zealand's own land and sea as global crises multiply.",
  },
  {
    title: "How to use regenerative agriculture in your own garden",
    source: "The Spinoff",
    url: "https://thespinoff.co.nz/partner/17-09-2025/how-to-use-regenerative-agriculture-in-your-own-garden",
    date: "2025-09-17",
    region: "NZ",
    summary:
      "No-dig beds, composting and cover crops let home gardeners build healthier soil — the same principles that improved soil structure and microbial life in a commercial Gisborne trial.",
  },
  {
    title: "Two years in the soil: lessons from real-life regenerative agriculture trials",
    source: "The Spinoff",
    url: "https://thespinoff.co.nz/partner/02-09-2025/two-years-in-the-soil-lessons-from-real-life-regenerative-agriculture-trials",
    date: "2025-09-02",
    region: "NZ",
    summary:
      "LeaderBrand's vegetable trials used cover crops and compost to maintain or improve yields while a legume cover crop cut fertiliser inputs by 34% — hard data behind the regenerative claims.",
  },
  {
    title: "One in three struggle to buy food — but shame stops many getting help",
    source: "1News",
    url: "https://www.1news.co.nz/2026/03/13/one-in-three-struggle-to-buy-food-but-shame-stops-many-getting-help/",
    date: "2026-03-13",
    region: "NZ",
    summary:
      "The NZ Food Network's Hunger Monitor found one in three households faced food insecurity in the past year, with roughly half held back from seeking help by shame or embarrassment.",
  },

  // ── International ─────────────────────────────────────────────────────────
  {
    title: "Economic and environmental benefits of regenerative agriculture vary by region",
    source: "Phys.org",
    url: "https://phys.org/news/2026-06-economic-environmental-benefits-regenerative-agriculture.html",
    date: "2026-06-25",
    region: "International",
    summary:
      "A Wageningen University study of 40 European farms found regenerative agriculture's economic and environmental gains depend heavily on local conditions, calling for farm-specific transition strategies.",
  },
  {
    title: "SAI Platform unveils regenerative agriculture framework backed by global food companies",
    source: "New Food Magazine",
    url: "https://www.newfoodmagazine.com/news/sai-platform-unveils-regenerative-agriculture-framework-backed-by-global-food-companies/2135815.article",
    date: "2026-06-25",
    region: "International",
    summary:
      "The SAI Platform's 'Regenerating Together' programme — backed by 40+ companies including Nestlé and McCain — sets a verification system for regenerative crop, beef and dairy production across 25 countries.",
  },
  {
    title: "Why big food is exploring regenerative agriculture",
    source: "CNN Business",
    url: "https://edition.cnn.com/2026/06/18/business/why-big-food-is-exploring-regenerative-agriculture-spc",
    date: "2026-06-18",
    region: "International",
    summary:
      "A look at why major food companies are turning to regenerative agriculture across their supply chains — as a way to secure ingredients, cut emissions and build long-term resilience.",
  },
  {
    title: "Nescafé sources over half its coffee from farmers adopting regenerative agriculture",
    source: "Nestlé",
    url: "https://www.nestle.com/media/news/nescafe-plan-2030-progress-report-2025-regenerative-agriculture",
    date: "2026-06-18",
    region: "International",
    summary:
      "Nescafé reported sourcing 53% of its green coffee from regenerative farmers in 2025 — backing 100,000+ farmers across 15 countries and cutting supply-chain emissions 18.3% against a 2018 baseline.",
  },
  {
    title: "Barley, reimagined: Boortmalt's shift to regenerative farming",
    source: "WBCSD",
    url: "https://www.wbcsd.org/resources/barley-reimagined-boortmalts-shift-to-regenerative-farming/",
    date: "2026-06-23",
    region: "International",
    summary:
      "Global malting company Boortmalt is moving its barley supply chain to regenerative practices in Ireland, France and Argentina, focusing on soil health and farm economics rather than premium pricing.",
  },
  {
    title: "Biochar Now and ATP announce results from Guatemala regenerative agriculture project",
    source: "PRWeb",
    url: "https://www.prweb.com/releases/biochar-now-and-atp-announce-results-from-guatemala-regenerative-agriculture-project-302808946.html",
    date: "2026-06-24",
    region: "International",
    summary:
      "A Guatemala demonstration using biochar as a soil amendment reported 90% higher spinach yields and beneficial microbial colonisation on crop roots, supporting biochar's role in soil biology.",
  },
  {
    title: "Here's why regenerative farming is a risk management story, not an ESG story",
    source: "Global AgInvesting",
    url: "https://globalaginvesting.com/heres-why-regenerative-farming-is-a-risk-management-story-not-an-esg-story/",
    date: "2026-06-18",
    region: "International",
    summary:
      "The case that regenerative farming should be judged as financial risk mitigation: soil degradation creates measurable vulnerabilities, and healthier soil and lower inputs build portfolio resilience.",
  },
  {
    title: "Making high residue work in regenerative farming: how to reduce risks and protect yield",
    source: "MSU Extension",
    url: "https://www.canr.msu.edu/news/making-high-residue-work-in-regenerative-farming-how-to-reduce-risks-and-protect-yield",
    date: "2026-06-23",
    region: "International",
    summary:
      "Practical strategies for managing crop residue in regenerative systems — balancing soil-health gains against challenges like delayed emergence and pests with flexible, systems-based approaches.",
  },
  {
    title: "Regenerative farming 101: what to know if you're making the switch",
    source: "Ohio Farm Bureau",
    url: "https://ofbf.org/2026/06/22/regenerative-farming-101-what-to-know-if-youre-making-the-switch/",
    date: "2026-06-22",
    region: "International",
    summary:
      "A primer on the move to regenerative agriculture — minimal tillage, crop rotation and cover cropping — weighing benefits like soil health and lower costs against an adjustment period of up to five years.",
  },
  {
    title: "Avoid these common pitfalls when considering regenerative ag",
    source: "Farm Progress",
    url: "https://www.farmprogress.com/conservation-and-sustainability/avoid-these-common-pitfalls-when-considering-regenerative-ag",
    date: "2026-06-19",
    region: "International",
    approxDate: true,
    summary:
      "An Indiana farmer shares lessons from transitioning to no-till and cover crops — preparing equipment, planning for setbacks, and integrating livestock to feed soil biology.",
  },
  {
    title: "Groundswell review: raising a cup to regenerative agriculture",
    source: "POV Magazine",
    url: "https://povmagazine.com/groundswell-review-raising-a-cup-to-regenerative-agriculture/",
    date: "2026-06-15",
    region: "International",
    summary:
      "A review of the documentary 'Groundswell', which takes an optimistic view of regenerative farming worldwide as a way to reverse environmental damage and inspire consumer change.",
  },
  {
    title: "Regenerative farming helps this Utah farmer use less water during a dry year",
    source: "Fox 13 (Salt Lake City)",
    url: "https://www.fox13now.com/news/local-news/weber-county/regenerative-farming-helps-this-utah-farmer-use-less-water-during-dry-year",
    date: "2026-06-12",
    region: "International",
    approxDate: true,
    summary:
      "Argyle Acres uses rotational grazing and chicken tractors to build soil that holds far more water — letting the farm cut water use dramatically during Utah's drought while producing healthier meat.",
  },
  {
    title: "Regenerative agriculture awareness climbs as health priorities shift",
    source: "Meat+Poultry",
    url: "https://www.meatpoultry.com/articles/33700-regenerative-agriculture-awareness-climbs-as-health-priorities-shift",
    date: "2026-06-01",
    region: "International",
    approxDate: true,
    summary:
      "Consumer awareness of regenerative agriculture nearly doubled in a year, with shoppers ranking personal health and freshness above environmental reasons — and more buying directly from farmers.",
  },
  {
    title: "From 'sustainable' to 'regenerative' agriculture: what's in a name?",
    source: "The Conversation",
    url: "https://theconversation.com/from-sustainable-to-regenerative-agriculture-whats-in-a-name-275209",
    date: "2026-04-08",
    region: "International",
    summary:
      "An argument that regenerative agriculture must be grounded in an environmental ethic — a reciprocal relationship with the land — rather than reduced to a marketable checklist of practices.",
  },
  {
    title: "Worms Against Waste",
    source: "ANU (Green Gown Awards Australasia 2025)",
    url: "https://ggaa.acts.asn.au/2025/leading-the-circular-economy/anu-worms-against-waste/",
    date: "2025-08-01",
    region: "International",
    approxDate: true,
    summary:
      "The Australian National University's community vermiculture project diverts campus food waste into compost and worm tea for its kitchen garden — a hands-on circular-economy model.",
  },
];

/** Articles sorted newest-first for display. */
export const LIBRARY_ARTICLES: LibraryArticle[] = [...ARTICLES].sort((a, b) =>
  b.date.localeCompare(a.date)
);

/** Format an ISO date as "Mon YYYY" (month precision keeps approx dates honest). */
export function formatArticleDate(iso: string): string {
  const [year, month] = iso.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const m = months[Number(month) - 1] ?? "";
  return `${m} ${year}`.trim();
}

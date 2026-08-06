/**
 * Photo & video assets.
 *
 * Drop files into the folders below, then this config wires them in.
 * Anything left as `null` shows a graceful fallback (gradient / placeholder),
 * so the site never looks broken while assets are still being produced.
 *
 *  ┌─ Asset ─────────────┬─ Put the file in ─┬─ Spec ───────────────────────────────┐
 *  │ Hero background      │ public/images/    │ Landscape 2400×1350 (16:9), JPG/WebP, │
 *  │                      │                   │ optimised < 350 KB. Keep the left side │
 *  │                      │                   │ relatively calm (headline sits there). │
 *  │ Willowbank video     │ public/videos/    │ Portrait 720×1280 (9:16) MP4 (H.264),  │
 *  │                      │                   │ ideally < 20 MB.                       │
 *  │ Process video        │ public/videos/    │ Portrait 720×1280 (9:16) MP4 (H.264).  │
 *  │ Video posters (opt.) │ public/images/    │ Portrait 720×1280 JPG — first frame.   │
 *  │ Willowbank logo      │ public/logos/     │ SVG or transparent PNG.                │
 *  └──────────────────────┴───────────────────┴────────────────────────────────────────┘
 */
export const MEDIA = {
  // Home hero — shown beneath the gradient/overlay. Missing file → gradient only.
  heroImage: "/images/hero.webp" as string | null,

  // Willowbank case study (Home)
  willowbankVideo: "/videos/willowbank.mp4" as string | null,
  willowbankPoster: null as string | null, // add /images/willowbank-poster.jpg when ready
  willowbankLogo: "/logos/willowbank.jpg" as string | null,

  // Uncle Bob's sister-brand logo (Home "from waste to resource" section)
  uncleBobsLogo: "/logos/uncle-bobs.png" as string | null,

  // Our Process — Mark + composting machine
  processVideo: "/videos/process.mp4" as string | null,
  processPoster: null as string | null,     // add /images/process-poster.jpg when ready

  // ── Photography (curated from the team's asset library) ─────────────────
  collectInAction: "/images/collect-bin-cafe.png" as string | null,   // worker collecting a bin at a Canterbury café
  wormsInHands: "/images/worms-soil-hands.webp" as string | null,     // compost worms in soil — the core of the business
  sudimaHotel: "/images/sudima-hotel.png" as string | null,           // Sudima hotel exterior
  forestMist: "/images/forest-mist.jpg" as string | null,             // misty native forest — atmospheric dark bg
  christchurchHarbour: "/images/christchurch-harbour.webp" as string | null, // Lyttelton / Canterbury panorama
  handsTogether: "/images/hands-together.webp" as string | null,      // many hands — partnership / community
  chefKitchen: "/images/chef-kitchen.jpg" as string | null,           // chef in a commercial kitchen
  kitchenOverhead: "/images/kitchen-overhead.webp" as string | null,  // overhead of chefs in a restaurant kitchen
  foodScraps: "/images/food-scraps.jpg" as string | null,             // food peelings — the waste we divert
  compostingMachine: "/images/composting-machine.png" as string | null, // industrial composter

  // Cinematic landscapes (golden-hour NZ pastoral — compost → growth story). Great as section backdrops.
  landscapeHills: "/images/landscape-hills-bins.png" as string | null,   // hills, bins, seedling on compost
  landscapeDawn: "/images/landscape-dawn.png" as string | null,          // misty dawn mountains + seedlings
  landscapeTruck: "/images/landscape-truck.png" as string | null,        // hills, farm truck, compost beds

  // Uncle Bob's product range
  products: {
    worms: "/images/product-worms.png",
    plantFood: "/images/product-plant-food.png",
    vermicast: "/images/product-vermicast.png",
    fertiliser: "/images/product-fertiliser.png",
  },

  // Team
  team: {
    group: "/images/team-group.png",
    coFounders: "/images/team-mark-juline.jpg",
    david: "/images/team-david.png",
    ian: "/images/team-ian.png",
    mido: "/images/team-mido.png",
    tim: "/images/team-tim.png",
  },
};

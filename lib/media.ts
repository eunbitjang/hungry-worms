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
  heroImage: "/images/hero.jpg" as string | null,

  // Willowbank case study (Home)
  willowbankVideo: "/videos/willowbank.mp4" as string | null,
  willowbankPoster: "/images/willowbank-poster.jpg" as string | null,
  willowbankLogo: "/logos/willowbank.svg" as string | null,

  // Our Process — Mark + composting machine
  processVideo: "/videos/process.mp4" as string | null,
  processPoster: "/images/process-poster.jpg" as string | null,
};

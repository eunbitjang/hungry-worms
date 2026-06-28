import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // 301 redirects from the old Wix URLs to the new structure, so existing
  // Google rankings and inbound links carry over instead of hitting 404s.
  // Mapping is based on the full set of Google-indexed URLs (Search Console
  // export, June 2026). Pages that kept their path (/ and /faq) need no entry.
  async redirects() {
    return [
      // ── Canonical host: force the bare apex (hungryworms.nz) to www ───────
      // GSC was indexing the non-www host as a separate property. Funnel all
      // apex traffic to the single canonical https://www.hungryworms.nz so
      // ranking signals don't get split. The www host is left untouched, so
      // there's no redirect loop. The .co.nz apex/www variants are likewise
      // consolidated onto the primary .nz domain.
      {
        source: "/:path*",
        has: [{ type: "host", value: "hungryworms.nz" }],
        destination: "https://www.hungryworms.nz/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "(www\\.)?hungryworms\\.co\\.nz" }],
        destination: "https://www.hungryworms.nz/:path*",
        permanent: true,
      },

      // ── Marketing pages renamed in the new site ──────────────────────────
      { source: "/waste-collection-1", destination: "/services", permanent: true },
      { source: "/our-process", destination: "/process", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/recycling", destination: "/process", permanent: true },

      // ── Old Wix shop → the standalone Uncle Bob's store ──────────────────
      // The webshop now lives on unclebobs.co.nz. Wildcards also catch any
      // shop URLs not in the indexed set (stray inbound links, old shares).
      { source: "/shipping-returns", destination: "https://www.unclebobs.co.nz/", permanent: true },
      // Two old product pages still indexed in GSC. Point them at the matching
      // current products on Uncle Bob's (not the generic homepage below) so the
      // 301 recovers residual link value instead of being treated as a soft 404.
      // These must precede the /product-page/:path* catch-all (first match wins).
      {
        source: "/product-page/premium-wool-pellets",
        destination: "https://www.unclebobs.co.nz/shop-all/p/premium-wool-pellets-for-plants-500g",
        permanent: true,
      },
      {
        source: "/product-page/premium-vermicast-tonic-20-ltr-container",
        destination:
          "https://www.unclebobs.co.nz/shop-all/p/premium-natural-soil-conditioner-growth-booster-20l-bulk-concentrate",
        permanent: true,
      },
      { source: "/product-page/:path*", destination: "https://www.unclebobs.co.nz/", permanent: true },
      { source: "/category/:path*", destination: "https://www.unclebobs.co.nz/", permanent: true },

      // ── /worms → straight to the worms product on Uncle Bob's ────────────
      // We dropped the standalone /worms bridge page in favour of sending all
      // worm-buyer traffic directly to the shop for the fastest conversion.
      // This 301 keeps the URL (already in the sitemap / shared) converting.
      {
        source: "/worms",
        destination:
          "https://www.unclebobs.co.nz/shop-all/p/premium-composting-worms?utm_source=hungryworms&utm_medium=referral&utm_campaign=worms_redirect",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

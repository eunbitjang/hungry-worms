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
      { source: "/product-page/:path*", destination: "https://www.unclebobs.co.nz/", permanent: true },
      { source: "/category/:path*", destination: "https://www.unclebobs.co.nz/", permanent: true },
    ];
  },
};

export default nextConfig;

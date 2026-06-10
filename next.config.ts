import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // 301/308 redirects from the old Wix URLs to the new structure, so existing
  // Google rankings and inbound links carry over instead of hitting 404s.
  // NOTE: this covers the known core pages — extend once we have the full list
  // of indexed old URLs from the Wix sitemap / Search Console.
  async redirects() {
    return [
      { source: "/waste-collection-1", destination: "/services", permanent: true },
      { source: "/our-process", destination: "/process", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
    ];
  },
};

export default nextConfig;

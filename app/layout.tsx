import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import ConditionalShell from "./components/ConditionalShell";

// GA4 measurement ID comes from the environment (never hard-coded). Set
// NEXT_PUBLIC_GA_ID in Vercel / .env.local — see .env.example. The tag only
// loads in production builds, so local dev and previews don't pollute analytics.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GA_ENABLED = process.env.NODE_ENV === "production" && Boolean(GA_ID);

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const SITE_URL = "https://www.hungryworms.nz";

// Organization + LocalBusiness structured data (site-wide) — helps Google show
// rich/knowledge results and strengthens local SEO for Canterbury searches.
const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: "Hungry Worms",
  legalName: "Hungry Worms Ltd",
  url: SITE_URL,
  logo: `${SITE_URL}/logos/hungry-worms.png`,
  image: `${SITE_URL}/opengraph-image`,
  description:
    "Canterbury's full-circle commercial food & green-waste recycling. We collect food & green waste, recycle it through compost worms, and turn it into 100% natural fertiliser.",
  telephone: "+64 20 4184 1840",
  email: "info@hungryworms.nz",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Christchurch",
    addressRegion: "Canterbury",
    addressCountry: "NZ",
  },
  areaServed: { "@type": "Place", name: "Canterbury, New Zealand" },
  sameAs: [
    "https://www.instagram.com/hungrywormsnz/",
    "https://www.facebook.com/hungrywormsnz",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hungry Worms — Commercial Food & Green Waste Recycling | Canterbury, NZ",
    template: "%s | Hungry Worms",
  },
  description:
    "Canterbury's full-circle commercial food & green-waste recycling. Measurable ESG impact, zero-hassle onboarding, and a one-month trial with no long-term commitment. Trusted by Sudima, Mitre 10, Ballantynes and more.",
  openGraph: {
    siteName: "Hungry Worms",
    locale: "en_NZ",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-NZ"
      className={`${inter.variable} ${plusJakarta.variable}`}
    >
      <body className="flex min-h-screen flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
        <ConditionalShell>{children}</ConditionalShell>
      </body>
      {GA_ENABLED && <GoogleAnalytics gaId={GA_ID!} />}
    </html>
  );
}

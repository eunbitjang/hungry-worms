import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ConditionalShell from "./components/ConditionalShell";

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

const SITE_URL = "https://hungryworms.nz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hungry Worms — Commercial Food & Green Waste Recycling | Canterbury, NZ",
    template: "%s | Hungry Worms",
  },
  description:
    "Canterbury's full-circle commercial food & green-waste recycling. Measurable ESG impact, zero-hassle onboarding, free trial. Trusted by Sudima, Mitre 10, Ryman Healthcare and more.",
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
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}

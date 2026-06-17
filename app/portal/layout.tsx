import type { Metadata } from "next";

// The portal (client dashboards + staff tools, incl. the open "Log a pickup"
// form) is private and must never show up in search results. robots.txt
// already disallows crawling /portal/; this noindex is the belt-and-suspenders
// guarantee for any URL that does get fetched (e.g. a shared link). Child pages
// can still set their own title — metadata merges.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

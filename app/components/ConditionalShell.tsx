"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

export default function ConditionalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPortal = pathname?.startsWith("/portal");

  if (isPortal) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

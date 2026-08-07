"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";
import { UNCLE_BOBS } from "@/lib/links";

/** Matches ScrollToTop's own reveal threshold — keep the two in sync. */
const SCROLL_TO_TOP_AT = 500;

/**
 * Persistent floating "Buy Worms" pill, shown site-wide on the marketing pages.
 * It gives worm-buyers a one-tap exit to the shop from any page, no matter how
 * far they've scrolled. Sits bottom-right — the reach zone for right-handed
 * thumbs — stacked directly above the "back to top" button (ScrollToTop), and
 * drops down to fill its place while that button is still hidden.
 *
 * Fades in just after first scroll so it isn't competing with the hero CTAs on
 * initial load.
 */
export default function BuyWormsFab() {
  const [scrolled, setScrolled] = useState(false);
  const [raised, setRaised] = useState(false);
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 300);
      setRaised(window.scrollY > SCROLL_TO_TOP_AT);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide while the footer is on screen — it has its own Uncle Bob's button,
  // and the pill would otherwise cover the copyright line.
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setFooterInView(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const visible = scrolled && !footerInView;

  return (
    <a
      href={UNCLE_BOBS.worms}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buy composting worms at Uncle Bob's shop"
      className={`fixed right-6 z-40 hidden sm:inline-flex items-center gap-2 rounded-full bg-cta px-4 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-cta)] ring-1 ring-white/10 transition-all duration-300 hover:bg-cta-dark hover:-translate-y-0.5 ${
        raised ? "bottom-20" : "bottom-6"
      } ${visible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"}`}
    >
      <Icon name="worm" className="size-4" />
      Buy Worms
      <span aria-hidden="true" className="text-xs">↗</span>
    </a>
  );
}

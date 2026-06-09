"use client";

import { useEffect, useState } from "react";

/**
 * Floating "back to top" button. Fades in after the user scrolls down,
 * smooth-scrolls to the top on click. Respects reduced-motion.
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-40 flex size-11 items-center justify-center rounded-full bg-green-deep text-white shadow-lg ring-1 ring-white/10 transition-all duration-300 hover:bg-green-primary hover:-translate-y-0.5 ${
        visible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
      }`}
    >
      <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

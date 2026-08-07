"use client";

import { useEffect, useRef, useState } from "react";

interface CountingNumberProps {
  /** Final value to count up to. */
  target: number;
  /** Value the count starts from. */
  from?: number;
  /** Decimal places — must match how the number is normally formatted. */
  decimals?: number;
  /** Animation length in ms. */
  duration?: number;
  /** Wait this long after the element scrolls into view before counting. */
  delay?: number;
  className?: string;
}

/** Same formatting as `formatNumber` in lib/data/hero.ts, so SSR and client agree. */
function format(n: number, decimals: number): string {
  return n.toLocaleString("en-NZ", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/* easeOutCubic — fast off the mark, gentle landing */
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counts up to `target` the first time it scrolls into view.
 *
 * Renders the final formatted value on the server (so crawlers and no-JS
 * visitors see the real number, and hydration matches), then rewinds to
 * `from` and animates once mounted. Honours prefers-reduced-motion.
 */
export default function CountingNumber({
  target,
  from = 0,
  decimals = 0,
  duration = 1100,
  delay = 0,
  className = "",
}: CountingNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() => format(target, decimals));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let timer: ReturnType<typeof setTimeout>;
    let start: number | null = null;

    const step = (now: number) => {
      if (start === null) start = now;
      const t = Math.min((now - start) / duration, 1);
      setDisplay(format(from + (target - from) * ease(t), decimals));
      if (t < 1) frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        // The first frame renders `from`, so the final value stays on screen
        // until the animation can actually run (e.g. a backgrounded tab).
        timer = setTimeout(() => {
          frame = requestAnimationFrame(step);
        }, delay);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [target, from, decimals, duration, delay]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {display}
    </span>
  );
}

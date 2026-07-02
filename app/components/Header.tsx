"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import BrandLogo from "./BrandLogo";
import { UNCLE_BOBS } from "@/lib/links";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Our Process" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-md border-b border-soil/10 shadow-[0_2px_20px_rgba(43,42,38,0.06)]"
          : "bg-white/60 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 text-green-deep hover:text-green-primary transition-colors"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <BrandLogo variant="light" priority />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-soil/80" aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`link-underline transition-colors hover:text-green-primary ${
                  pathname === href ? "text-green-primary font-semibold" : ""
                }`}
              >
                {label}
              </Link>
            ))}
            <a
              href={UNCLE_BOBS.worms}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-green-leaf font-semibold hover:text-green-primary transition-colors"
            >
              <Icon name="worm" className="size-4" />
              Buy Worms
              <span aria-hidden="true" className="text-xs">↗</span>
            </a>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              href="/portal"
              className="text-sm font-semibold text-green-primary hover:text-green-deep transition-colors"
            >
              Client Login
            </Link>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-1.5 rounded-full bg-cta px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-cta)] hover:bg-cta-dark transition-all hover:gap-2.5"
            >
              Free Trial
              <Icon name="arrow-right" className="size-3.5" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 text-soil rounded-md hover:bg-green-primary/10 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="md:hidden border-t border-soil/10 bg-white px-4 pb-5">
          <nav className="flex flex-col gap-0.5 pt-3" aria-label="Mobile navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-green-primary/5 hover:text-green-primary ${
                  pathname === href ? "text-green-primary bg-green-primary/5" : "text-soil"
                }`}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <a
              href={UNCLE_BOBS.worms}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-green-leaf hover:text-green-primary transition-colors"
            >
              <Icon name="worm" className="size-4" />
              Buy Worms ↗
            </a>
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/portal"
              className="block rounded-full border border-green-primary px-4 py-2.5 text-center text-sm font-semibold text-green-primary hover:bg-green-primary/5 transition-colors"
              onClick={() => setOpen(false)}
            >
              Client Login
            </Link>
            <Link
              href="/contact"
              className="block rounded-full bg-cta px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-cta-dark transition-colors"
              onClick={() => setOpen(false)}
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

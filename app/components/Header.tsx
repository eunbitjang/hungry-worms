"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Our Process" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-green-primary/10 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 font-display font-bold text-green-deep hover:text-green-primary transition-colors"
          >
            {/* Placeholder logo — replace with <Image> once brand assets supplied */}
            <span
              className="flex size-9 items-center justify-center rounded-full bg-green-primary text-white text-lg font-bold leading-none"
              aria-hidden="true"
            >
              W
            </span>
            <span className="text-[1.05rem] leading-tight">
              Hungry Worms
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-soil/80" aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`hover:text-green-primary transition-colors ${
                  pathname === href ? "text-green-primary font-semibold" : ""
                }`}
              >
                {label}
              </Link>
            ))}
            <a
              href="https://www.unclebobs.co.nz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-leaf font-semibold hover:text-green-primary transition-colors"
            >
              Uncle Bob&apos;s Shop ↗
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
              className="rounded-full bg-cta px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cta-dark transition-colors"
            >
              Free Trial
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
        <div id="mobile-menu" className="md:hidden border-t border-green-primary/10 bg-white px-4 pb-5">
          <nav className="flex flex-col gap-0.5 pt-3" aria-label="Mobile navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-green-primary/5 hover:text-green-primary ${
                  pathname === href ? "text-green-primary bg-green-primary/5" : "text-soil"
                }`}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <a
              href="https://www.unclebobs.co.nz/"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-md px-3 py-2.5 text-sm font-semibold text-green-leaf hover:text-green-primary transition-colors"
            >
              Uncle Bob&apos;s Shop ↗
            </a>
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/portal"
              className="block rounded-lg border border-green-primary px-4 py-2.5 text-center text-sm font-semibold text-green-primary hover:bg-green-primary/5 transition-colors"
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

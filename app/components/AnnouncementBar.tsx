"use client";

import { useSyncExternalStore } from "react";
import Icon from "./Icon";
import { UNCLE_BOBS } from "@/lib/links";

/**
 * Slim, dismissible top bar that catches visitors who arrived looking to *buy*
 * composting worms (a common search) before they bounce off the B2B hero.
 * It speaks their words ("buy composting worms") and routes them straight to
 * the worms product page on our sister shop, Uncle Bob's.
 *
 * Dismissal is remembered in localStorage so it only nudges once. We read that
 * flag through useSyncExternalStore: the server snapshot is "dismissed" so the
 * bar never flashes during hydration, and dismissing notifies subscribers in
 * the same tab (the native `storage` event only fires in *other* tabs).
 */
const DISMISS_KEY = "hw_worms_bar_dismissed";
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot() {
  return localStorage.getItem(DISMISS_KEY) === "1";
}

function getServerSnapshot() {
  return true; // render nothing on the server → no hydration flash
}

function dismiss() {
  try {
    localStorage.setItem(DISMISS_KEY, "1");
  } catch {
    /* private mode — listeners below still hide it for this session */
  }
  listeners.forEach((l) => l());
}

export default function AnnouncementBar() {
  const dismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (dismissed) return null;

  return (
    <div className="relative bg-green-deep text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5 py-2 pr-8 text-center text-sm">
          <Icon name="sprout" className="size-4 shrink-0 text-green-leaf" />
          <span className="text-white/85">
            Want to <strong className="font-semibold text-white">buy composting worms</strong> or garden products?
          </span>
          <a
            href={UNCLE_BOBS.worms}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-green-leaf underline-offset-2 hover:underline"
          >
            Shop at Uncle Bob&apos;s
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
      >
        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

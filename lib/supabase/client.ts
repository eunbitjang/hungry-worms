"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client — use in Client Components only.
 * Uses the anon key; RLS policies enforce per-user data access.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

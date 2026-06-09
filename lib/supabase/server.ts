import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client — use in Server Components and Route Handlers.
 * Reads the session cookie so RLS policies apply to the logged-in user.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — cookie writes are ignored (handled by middleware)
          }
        },
      },
    }
  );
}

/**
 * Admin client that bypasses RLS — ONLY for server-side sync jobs.
 * Never expose this to the browser or use in user-facing routes.
 */
export function createAdminClient() {
  const { createClient: createSupabaseClient } = require("@supabase/supabase-js") as typeof import("@supabase/supabase-js");
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh expired sessions
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users away from protected portal routes.
  // (Per-route role checks like `is_staff` are enforced in the page itself.)
  //
  // NOTE: the staff hub (`/portal/staff`) and the "Log a pickup" form
  // (`/portal/staff/pickup`) are intentionally left OPEN — no login required —
  // so field staff can log pickups without dealing with sign-in. The
  // all-clients dashboard (`/portal/staff/dashboard`) stays protected because
  // it exposes every client's data.
  const path = request.nextUrl.pathname;
  const needsAuth =
    path.startsWith("/portal/dashboard") || path.startsWith("/portal/staff/dashboard");
  if (needsAuth && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/portal";
    loginUrl.searchParams.set("next", path);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/portal/dashboard/:path*", "/portal/staff/:path*"],
};

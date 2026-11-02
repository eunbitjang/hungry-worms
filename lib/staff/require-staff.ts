import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * For staff API routes that change saved data or settings. Returns the
 * signed-in staff user's email, or a ready-made error response.
 */
export async function requireStaff(
  action: string
): Promise<{ email: string; denied?: undefined } | { denied: NextResponse }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { denied: NextResponse.json({ error: `Please sign in to ${action}.` }, { status: 401 }) };
  const { data: profile } = await supabase.from("profiles").select("is_staff").eq("id", user.id).single();
  if (!profile?.is_staff) return { denied: NextResponse.json({ error: "Staff access only." }, { status: 403 }) };
  return { email: user.email ?? "staff" };
}

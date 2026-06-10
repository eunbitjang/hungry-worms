"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";

export default function PortalLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Where to go after login: honour a ?next= deep link (e.g. a bookmarked
  // /portal/staff/pickup), but only allow internal portal paths.
  function destination() {
    if (typeof window === "undefined") return "/portal/dashboard";
    const next = new URLSearchParams(window.location.search).get("next");
    return next && next.startsWith("/portal") ? next : "/portal/dashboard";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const supabase = createClient();

    if (mode === "password") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg(error.message);
        setStatus("error");
      } else {
        router.push(destination());
        router.refresh();
      }
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/portal/auth/callback?next=${encodeURIComponent(destination())}`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  return (
    <div className="min-h-screen bg-offwhite flex flex-col">
      {/* Portal header */}
      <header className="bg-green-deep px-6 py-4 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 text-white hover:text-green-leaf transition-colors">
          <span className="flex size-9 items-center justify-center rounded-lg bg-white shadow-sm">
            <Image src="/logos/hungry-worms.png" alt="Hungry Worms" width={28} height={28} className="size-7 object-contain" />
          </span>
          <span className="font-display font-bold text-sm">Hungry Worms</span>
        </Link>
        <span className="text-white/40 text-sm">/ Impact Portal</span>
      </header>

      {/* Login card */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Image
              src="/logos/hungry-worms.png"
              alt="Hungry Worms"
              width={120}
              height={120}
              priority
              className="mx-auto mb-5 size-28 object-contain"
            />
            <h1 className="font-display text-2xl font-extrabold text-green-deep">Client Portal</h1>
            <p className="mt-1 text-sm text-soil/60">Sign in to view your impact dashboard</p>
          </div>

          <div className="rounded-2xl bg-white border border-green-primary/10 p-8 shadow-sm">
            {status === "sent" ? (
              <div className="text-center space-y-3">
                <div className="text-4xl">📬</div>
                <h2 className="font-display font-bold text-green-deep text-lg">Check your email</h2>
                <p className="text-sm text-soil/70 leading-relaxed">
                  We sent a sign-in link to <strong>{email}</strong>. Click it to access your dashboard.
                </p>
                <p className="text-xs text-soil/40">Link expires in 1 hour. Check your spam folder if it doesn't arrive.</p>
                <button
                  onClick={() => { setStatus("idle"); setEmail(""); }}
                  className="mt-2 text-xs text-green-primary hover:underline"
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-soil/70 mb-1.5">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yourbusiness.co.nz"
                    className="w-full rounded-lg border border-soil/20 bg-offwhite px-3.5 py-2.5 text-sm text-soil placeholder:text-soil/30 focus:border-green-primary focus:outline-none focus:ring-2 focus:ring-green-primary/20"
                  />
                </div>

                {mode === "password" && (
                  <div>
                    <label htmlFor="password" className="block text-xs font-semibold text-soil/70 mb-1.5">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-soil/20 bg-offwhite px-3.5 py-2.5 text-sm text-soil placeholder:text-soil/30 focus:border-green-primary focus:outline-none focus:ring-2 focus:ring-green-primary/20"
                    />
                  </div>
                )}

                {status === "error" && (
                  <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-full bg-green-primary py-3 text-sm font-bold text-white hover:bg-green-deep disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {status === "sending"
                    ? mode === "password" ? "Signing in…" : "Sending link…"
                    : mode === "password" ? "Sign In" : "Send Magic Link"}
                </button>

                <p className="text-xs text-center text-soil/40">
                  {mode === "password" ? (
                    <button
                      type="button"
                      onClick={() => { setMode("magic"); setStatus("idle"); setErrorMsg(""); }}
                      className="text-green-primary hover:underline"
                    >
                      ← Use a magic link instead
                    </button>
                  ) : (
                    <>
                      We&apos;ll email you a secure sign-in link — no password needed.{" "}
                      <button
                        type="button"
                        onClick={() => { setMode("password"); setStatus("idle"); setErrorMsg(""); }}
                        className="text-green-primary hover:underline"
                      >
                        Sign in with a password
                      </button>
                    </>
                  )}
                </p>
              </form>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-soil/40">
            Not a client yet?{" "}
            <Link href="/contact" className="text-green-primary hover:underline font-semibold">
              Start your free trial
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

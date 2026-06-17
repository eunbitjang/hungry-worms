"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Icon, { type IconName } from "@/app/components/Icon";

const TOOLS: { href: string; icon: IconName; title: string; body: string }[] = [
  {
    href: "/portal/staff/dashboard",
    icon: "chart",
    title: "All-clients dashboard",
    body: "Company-wide impact across every client — totals, per-client breakdown, trends, and the full collection log with CSV export.",
  },
  {
    href: "/portal/staff/pickup",
    icon: "truck",
    title: "Log a pickup",
    body: "Record a client visit — all bins on one screen. Writes straight to the Master Log, no Google Form needed.",
  },
];

export default function StaffHub({ staffEmail }: { staffEmail: string }) {
  const router = useRouter();

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/portal");
  }

  return (
    <div className="min-h-screen bg-offwhite flex flex-col">
      <header className="bg-green-deep text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-white shadow-sm">
              <Image src="/logos/hungry-worms.png" alt="Hungry Worms" width={28} height={28} className="size-7 object-contain" />
            </span>
            <span className="leading-tight">
              <span className="block font-display font-bold text-sm">Staff Portal</span>
              <span className="block text-white/45 text-xs">Hungry Worms internal</span>
            </span>
          </Link>
          {staffEmail && (
            <button
              onClick={signOut}
              className="rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
            >
              Sign out
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-10">
        <h1 className="font-display text-2xl font-extrabold text-green-deep">Staff tools</h1>
        {staffEmail && (
          <p className="mt-1 text-sm text-soil/60">
            Signed in as <strong className="text-soil/80">{staffEmail}</strong>
          </p>
        )}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TOOLS.map(({ href, icon, title, body }) => (
            <Link
              key={href}
              href={href}
              className="card-lift group rounded-2xl bg-white border border-soil/10 p-6 shadow-[var(--shadow-card)]"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-green-primary/10 text-green-primary transition-colors group-hover:bg-green-primary group-hover:text-white">
                <Icon name={icon} className="size-6" />
              </div>
              <h2 className="mt-4 font-display text-lg font-bold text-green-deep">{title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-soil/65">{body}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-green-primary">
                Open
                <Icon name="arrow-right" className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-xs text-soil/45 leading-relaxed">
          Tip: bookmark the tool you use most, or add it to your phone&apos;s home screen for one-tap
          access — you&apos;ll stay signed in on that device.
        </p>
      </main>
    </div>
  );
}

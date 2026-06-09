import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getHeroStats, formatNumber } from "@/lib/data/hero";
import Icon, { type IconName } from "./components/Icon";
import Reveal from "./components/Reveal";

// ISR: cache the page for 10 minutes, then revalidate in the background
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Hungry Worms — Canterbury's Full-Circle Food Waste Recycling",
  description:
    "Effortless food waste recycling with real ESG impact. Trusted by Sudima, Mitre 10, Ryman Healthcare, and Willowbank. Start your free trial today.",
  openGraph: {
    title: "Hungry Worms — Canterbury's Full-Circle Food Waste Recycling",
    description:
      "Effortless food waste recycling with real ESG impact. Trusted by Sudima, Mitre 10, Ryman Healthcare, and Willowbank. Start your free trial today.",
    url: "/",
    type: "website",
  },
  alternates: { canonical: "/" },
};

/* ─── Partner logos ─────────────────────────────────────────────────────────
 * To show a real logo: drop the file into /public/logos/ and set `logo` to its
 * path (e.g. "/logos/sudima.svg"). Entries without a `logo` render as a text
 * chip, so you can add logos one at a time without breaking the strip.
 * SVG or transparent PNG works best. */
const PARTNERS: { name: string; logo?: string }[] = [
  { name: "Sudima Hotels" },
  { name: "Mitre 10" },
  { name: "Ryman Healthcare" },
  { name: "Willowbank Wildlife Reserve" },
  { name: "Ballantynes" },
  { name: "Cotswold Scenic Circle" },
  { name: "The Russley Village" },
];

/* ─── Three-step solution ───────────────────────────────────────────────── */
const STEPS: { step: string; icon: IconName; title: string; body: string }[] = [
  {
    step: "1",
    icon: "truck",
    title: "Collect",
    body: "We supply branded bins for your site and run a scheduled pick-up — clean, sanitised bins left every visit.",
  },
  {
    step: "2",
    icon: "recycle",
    title: "Recycle",
    body: "Your food & green waste feeds our compost worms and industrial composting process — nothing goes to landfill.",
  },
  {
    step: "3",
    icon: "report",
    title: "Report",
    body: "Monthly and annual impact reports: kg diverted, CO₂e avoided, car equivalents — ready for your ESG disclosures.",
  },
];

/* ─── Why choose us ─────────────────────────────────────────────────────── */
const WHY_US: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "sparkles",
    title: "Effortless",
    body: "We supply branded bins, handle every pickup, and keep your kitchen clean. Zero disruption to your team.",
  },
  {
    icon: "chart",
    title: "Measurable",
    body: "Monthly and annual ESG impact reports — real numbers for sustainability commitments, investor decks, and council reporting.",
  },
  {
    icon: "cycle",
    title: "Closed-loop",
    body: "Your waste becomes premium NZ-made plant food through Uncle Bob's. Local soil, local story — full circle.",
  },
  {
    icon: "gift",
    title: "Free trial, proven results",
    body: "Start with zero commitment. 99% of businesses who trial our service continue as long-term partners.",
  },
];

/* ─── Uncle Bob's product teasers ───────────────────────────────────────── */
const UNCLEBOBS_PRODUCTS = [
  "Premium Composting Worms",
  "All-Purpose Plant Food",
  "Premium Worm Castings",
  "Regenerative Solid Fertiliser",
];

export default async function HomePage() {
  const stats = await getHeroStats();

  const heroStats: { value: string; unit: string; label: string; icon: IconName }[] = [
    {
      value: formatNumber(stats.total_waste_kg),
      unit: "kg",
      label: "Waste diverted from landfill",
      icon: "bin",
    },
    {
      value: formatNumber(stats.total_co2e_kg),
      unit: "kg CO₂e",
      label: "Greenhouse gas avoided",
      icon: "leaf",
    },
    {
      value: formatNumber(stats.total_cars_year, 1),
      unit: "cars",
      label: "Off the road for a year",
      icon: "truck",
    },
  ];

  return (
    <>
      {/* ── 1. HERO ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-green-deep text-white bg-grain">
        <div className="absolute inset-0 bg-mesh" aria-hidden="true" />
        {/* drifting decorative glow */}
        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-green-leaf/10 blur-3xl animate-drift" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-leaf backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-green-leaf animate-pulse" />
              Canterbury, New Zealand · Full-circle recycling
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.75rem]">
              Turn your food waste into a{" "}
              <span className="text-gradient-leaf">sustainability story.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/75 max-w-2xl">
              Hungry Worms collects your commercial food &amp; green waste, recycles it
              through compost worms, and hands you monthly impact reports your ESG team
              will love — all with zero disruption to your operations.
            </p>
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-green-leaf/90">
              Be part of the solution, not the pollution.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-cta px-7 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-cta)] hover:bg-cta-dark transition-all hover:gap-3"
              >
                Start a Free Trial
                <Icon name="arrow-right" className="size-4" />
              </Link>
              <Link
                href="/services"
                className="rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                See How It Works
              </Link>
            </div>
          </div>

          {/* Hero KPI stats */}
          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:max-w-3xl">
            {heroStats.map(({ value, unit, label, icon }, i) => (
              <div
                key={label}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] px-6 py-5 backdrop-blur-md animate-count-up"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="absolute right-4 top-4 text-green-leaf/30 transition-colors group-hover:text-green-leaf/60">
                  <Icon name={icon} className="size-6" />
                </div>
                <div className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                  {value}
                </div>
                <div className="mt-0.5 text-xs font-bold uppercase tracking-widest text-green-leaf">
                  {unit}
                </div>
                <div className="mt-1.5 text-sm text-white/65">{label}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-white/40">
            <span className="size-1.5 rounded-full bg-green-leaf/60" />
            Live company-wide totals — synced daily from our Master Log.
          </p>
        </div>
      </section>

      {/* ── 2. TRUSTED-BY LOGO STRIP ───────────────────────────────────────── */}
      <section className="bg-white border-b border-soil/5 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-soil/40 mb-7">
            Trusted by New Zealand&apos;s leading organisations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {PARTNERS.map(({ name, logo }) =>
              logo ? (
                <div
                  key={name}
                  className="relative h-9 w-28 opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                >
                  <Image src={logo} alt={name} fill sizes="112px" style={{ objectFit: "contain" }} />
                </div>
              ) : (
                <div
                  key={name}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-soil/45 transition-colors hover:text-green-primary"
                  title={name}
                >
                  {name}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── 3. OUR SIMPLE-AS SOLUTION ──────────────────────────────────────── */}
      <section className="bg-offwhite py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-green-primary">How it works</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-soil sm:text-4xl">
              Our simple-as solution
            </h2>
            <p className="mt-3 text-soil/55 max-w-xl mx-auto">
              Three steps. Zero complexity. Real results.
            </p>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {STEPS.map(({ step, icon, title, body }, i) => (
              <Reveal key={step} delay={i * 120}>
                <div className="card-lift group relative h-full rounded-2xl bg-white border border-soil/8 p-8 shadow-[var(--shadow-card)]">
                  <span className="absolute right-7 top-7 font-display text-5xl font-extrabold text-green-primary/8 select-none">
                    {step}
                  </span>
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-green-primary/10 text-green-primary transition-colors group-hover:bg-green-primary group-hover:text-white">
                    <Icon name={icon} className="size-7" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-green-deep">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-soil/65">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 rounded-full border border-green-primary px-6 py-3 text-sm font-semibold text-green-primary hover:bg-green-primary hover:text-white transition-all hover:gap-3"
            >
              See full service details
              <Icon name="arrow-right" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. WILLOWBANK CLOSED-LOOP CASE STUDY ───────────────────────────── */}
      <section className="relative overflow-hidden bg-green-deep text-white py-20 lg:py-24 bg-grain">
        <div className="absolute inset-0 bg-mesh opacity-60" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-green-leaf/30 bg-green-leaf/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-green-leaf">
                Flagship case study
              </span>
              <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl leading-tight">
                Willowbank&apos;s full-circle story
              </h2>
              <p className="mt-5 text-white/75 leading-relaxed">
                Willowbank Wildlife Reserve generates food &amp; green waste every day. We collect it,
                recycle it through our compost worms into premium vermicast, and it becomes{" "}
                <strong className="text-white">Uncle Bob&apos;s plant food</strong> — sold back in
                Willowbank&apos;s own souvenir shop.
              </p>
              <p className="mt-4 text-white/75 leading-relaxed">
                Their waste literally returns to them as a premium retail product. That&apos;s not
                just recycling — that&apos;s regeneration.
              </p>
              <Link
                href="/contact"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-green-leaf px-6 py-3 text-sm font-bold text-soil hover:bg-white transition-all hover:gap-3"
              >
                Build your own closed loop
                <Icon name="arrow-right" className="size-4" />
              </Link>
            </Reveal>

            {/* Closed-loop visual */}
            <Reveal delay={150} className="flex justify-center">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-green-leaf/25 animate-drift" />
                <div className="absolute inset-6 rounded-full border border-white/5" />
                {[
                  { label: "Food Waste", sublabel: "Willowbank generates", angle: 0, color: "bg-white/10" },
                  { label: "Collect & Recycle", sublabel: "Hungry Worms picks up", angle: 90, color: "bg-green-primary/40" },
                  { label: "Worm Castings", sublabel: "Premium plant food", angle: 180, color: "bg-green-leaf/20" },
                  { label: "In-store Product", sublabel: "Sold at Willowbank shop", angle: 270, color: "bg-cta/25" },
                ].map(({ label, sublabel, angle, color }) => {
                  const rad = ((angle - 90) * Math.PI) / 180;
                  const r = 112;
                  const x = 50 + (r / 160) * 50 * Math.cos(rad);
                  const y = 50 + (r / 160) * 50 * Math.sin(rad);
                  return (
                    <div
                      key={label}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-xl ${color} border border-white/20 px-3 py-2 text-center backdrop-blur-md shadow-lg`}
                      style={{ left: `${x}%`, top: `${y}%`, width: "120px" }}
                    >
                      <div className="text-xs font-bold text-white">{label}</div>
                      <div className="text-[10px] text-white/60 mt-0.5">{sublabel}</div>
                    </div>
                  );
                })}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-1 rounded-full bg-green-deep/80 size-20 justify-center border border-green-leaf/20">
                    <Icon name="cycle" className="size-7 text-green-leaf" />
                    <div className="text-[10px] font-bold text-green-leaf">Full Circle</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 5. SUDIMA IMPACT + TESTIMONIAL ─────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Stat card */}
            <Reveal className="rounded-3xl bg-gradient-to-br from-green-primary/8 to-green-leaf/5 border border-green-primary/15 p-8 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-widest text-green-primary mb-4">
                Proven impact · Sudima Hotels
              </p>
              <p className="font-display text-3xl font-extrabold text-green-deep leading-snug">
                Offsetting an entire South Island vehicle fleet.
              </p>
              <p className="mt-4 text-soil/70 leading-relaxed">
                Since 2024, Hungry Worms has helped both Sudima Christchurch City and Sudima
                Christchurch Airport offset the GHG emissions of{" "}
                <strong>Sudima&apos;s entire South Island vehicle fleet</strong> through food-waste
                recycling alone.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="size-11 rounded-full bg-green-primary/15 flex items-center justify-center text-green-deep font-bold text-sm ring-2 ring-green-primary/10">RP</div>
                <div>
                  <div className="text-sm font-semibold text-soil">Rajas Patil</div>
                  <div className="text-xs text-soil/55">Hotel General Manager, Sudima Christchurch Airport</div>
                </div>
              </div>
            </Reveal>

            {/* Testimonial */}
            <Reveal delay={150}>
              <svg className="size-12 text-green-primary/20 mb-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <blockquote className="text-xl leading-relaxed text-soil font-medium">
                &ldquo;Hungry Worms is making food waste recycling effortless, seamlessly integrating
                it into our operations. They are playing a key role in helping us achieve our ESG
                goals, including offsetting emissions from our vehicle fleet. More than a service
                provider, they are a true sustainability partner.&rdquo;
              </blockquote>
              <p className="mt-5 text-sm font-semibold text-green-primary">— Rajas Patil, Sudima Christchurch Airport</p>
              <Link
                href="/contact"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-green-primary px-6 py-3 text-sm font-semibold text-white hover:bg-green-deep transition-all hover:gap-3"
              >
                Get your impact report
                <Icon name="arrow-right" className="size-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 6. WHY BUSINESSES CHOOSE US ────────────────────────────────────── */}
      <section className="bg-offwhite py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-green-primary">Why us</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-soil sm:text-4xl">
              Why Canterbury businesses choose us
            </h2>
            <p className="mt-3 text-soil/55">
              From cafés to rest homes to hotels — we make sustainability practical.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_US.map(({ icon, title, body }, i) => (
              <Reveal key={title} delay={i * 100}>
                <div className="card-lift group h-full rounded-2xl bg-white border border-soil/8 p-7 shadow-[var(--shadow-card)]">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-green-primary/10 text-green-primary transition-colors group-hover:bg-green-primary group-hover:text-white">
                    <Icon name={icon} className="size-6" />
                  </div>
                  <h3 className="mt-5 font-display font-bold text-green-deep text-lg">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-soil/65">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-cta px-8 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-cta)] hover:bg-cta-dark transition-all hover:gap-3"
            >
              Book a free consultation
              <Icon name="arrow-right" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. FROM WASTE TO RESOURCE — UNCLE BOB'S ─────────────────────────── */}
      <section className="relative overflow-hidden bg-green-primary text-white py-20 lg:py-24">
        <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-green-leaf/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-widest text-green-leaf mb-3">
                From waste to resource
              </p>
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl leading-tight">
                Your waste becomes premium NZ-made plant food.
              </h2>
              <p className="mt-5 text-white/80 leading-relaxed">
                Nothing we collect goes to waste. After recycling, the worm castings and compost
                become the foundation of <strong className="text-white">Uncle Bob&apos;s</strong>{" "}
                regenerative garden products — 100% natural, NZ-made, and available nationwide.
              </p>
              <a
                href="https://www.unclebobs.co.nz/"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-green-deep hover:bg-green-leaf hover:text-soil transition-all hover:gap-3"
              >
                Shop Uncle Bob&apos;s
                <span aria-hidden="true">↗</span>
              </a>
            </Reveal>
            <div className="grid grid-cols-2 gap-4">
              {UNCLEBOBS_PRODUCTS.map((product, i) => (
                <Reveal key={product} delay={i * 90}>
                  <div className="card-lift h-full rounded-2xl bg-white/10 border border-white/15 p-5 backdrop-blur-sm">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-green-leaf/20 text-green-leaf">
                      <Icon name="sprout" className="size-6" />
                    </div>
                    <div className="mt-3 text-sm font-semibold text-white">{product}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. FINAL CTA BAND ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-soil text-white py-20 lg:py-24 bg-grain">
        <div className="absolute inset-0 opacity-40 bg-mesh" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl leading-tight">
              Ready to start your sustainability journey?
            </h2>
            <p className="mt-4 text-white/65 text-lg leading-relaxed">
              Join the Canterbury businesses already diverting tonnes from landfill and earning
              real ESG credentials. Your free trial starts with a single conversation.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-cta px-8 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-cta)] hover:bg-cta-dark transition-all hover:gap-3"
              >
                Start a Free Trial
                <Icon name="arrow-right" className="size-4" />
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/25 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                Talk to us
              </Link>
            </div>
            <p className="mt-5 text-xs text-white/40">
              No commitment required. 99% of trial clients become long-term partners.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

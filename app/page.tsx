import Link from "next/link";
import type { Metadata } from "next";
import { getHeroStats, formatNumber } from "@/lib/data/hero";

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

/* ─── Partner logos — placeholder until brand assets supplied ───────────── */
const PARTNERS = [
  "Sudima Hotels",
  "Mitre 10",
  "Ryman Healthcare",
  "Willowbank Wildlife Reserve",
  "Ballantynes",
  "Cotswold Scenic Circle",
  "The Russley Village",
];

/* ─── Why choose us ─────────────────────────────────────────────────────── */
const WHY_US = [
  {
    icon: "✓",
    title: "Effortless",
    body: "We supply branded bins, handle every pickup, and keep your kitchen clean. Zero disruption to your team.",
  },
  {
    icon: "📊",
    title: "Measurable",
    body: "Monthly and annual ESG impact reports — real numbers for sustainability commitments, investor decks, and council reporting.",
  },
  {
    icon: "🔄",
    title: "Closed-loop",
    body: "Your waste becomes premium NZ-made plant food through Uncle Bob's. Local soil, local story — full circle.",
  },
  {
    icon: "🎁",
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

  const heroStats = [
    {
      value: formatNumber(stats.total_waste_kg),
      unit: "kg",
      label: "Waste diverted from landfill",
    },
    {
      value: formatNumber(stats.total_co2e_kg),
      unit: "kg CO₂e",
      label: "Greenhouse gas avoided",
    },
    {
      value: formatNumber(stats.total_cars_year, 1),
      unit: "cars",
      label: "Off the road for a year",
    },
  ];

  return (
    <>
      {/* ── 1. HERO ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-green-deep text-white">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-5" aria-hidden="true"
          style={{ backgroundImage: "radial-gradient(circle at 25% 60%, #7FB800 0%, transparent 50%), radial-gradient(circle at 75% 20%, #1F8A4C 0%, transparent 50%)" }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-green-leaf">
              Canterbury, New Zealand · Full-circle commercial recycling
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Turn your food waste into a{" "}
              <span className="text-green-leaf">sustainability story.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/80 max-w-2xl">
              Hungry Worms collects your commercial food &amp; green waste, recycles it
              through compost worms, and hands you monthly impact reports your ESG team
              will love — all with zero disruption to your operations.
            </p>
            <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-green-leaf/80">
              Be part of the solution, not the pollution.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-cta px-7 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-cta-dark transition-colors"
              >
                Start a Free Trial
              </Link>
              <Link
                href="/services"
                className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
              >
                See How It Works
              </Link>
            </div>
          </div>

          {/* Hero KPI stats */}
          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:max-w-2xl">
            {heroStats.map(({ value, unit, label }) => (
              <div
                key={label}
                className="rounded-2xl bg-white/10 backdrop-blur px-6 py-5 border border-white/10"
              >
                <div className="font-display text-3xl font-extrabold text-white animate-count-up">
                  {value}
                </div>
                <div className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-green-leaf">
                  {unit}
                </div>
                <div className="mt-1 text-sm text-white/70">{label}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-white/40 italic">
            Live company-wide totals — updated every 15 minutes from our Master Log.
          </p>
        </div>
      </section>

      {/* ── 2. TRUSTED-BY LOGO STRIP ───────────────────────────────────────── */}
      <section className="bg-white border-b border-green-primary/10 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-soil/50 mb-7">
            Trusted by New Zealand&apos;s leading organisations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {PARTNERS.map((name) => (
              <div
                key={name}
                className="rounded-lg bg-offwhite px-5 py-3 text-sm font-semibold text-soil/60 border border-soil/5"
                title={name}
              >
                {/* Placeholder — swap with <Image> once logo assets supplied */}
                {name}
              </div>
            ))}
          </div>
          <p className="text-center mt-5 text-xs text-soil/30 italic">
            Logo assets placeholder — supply final vectors to replace text chips
          </p>
        </div>
      </section>

      {/* ── 3. OUR SIMPLE-AS SOLUTION ──────────────────────────────────────── */}
      <section className="bg-offwhite py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-extrabold text-soil sm:text-4xl">
            Our simple-as solution
          </h2>
          <p className="mt-3 text-soil/60 max-w-xl mx-auto">
            Three steps. Zero complexity. Real results.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                step: "1",
                icon: "🚛",
                title: "Collect",
                body: "We supply branded bins for your site and run a scheduled pick-up — clean, sanitised bins left every visit.",
              },
              {
                step: "2",
                icon: "🪱",
                title: "Recycle",
                body: "Your food &amp; green waste feeds our compost worms and industrial composting process — nothing goes to landfill.",
              },
              {
                step: "3",
                icon: "📋",
                title: "Report",
                body: "Monthly and annual impact reports: kg diverted, CO₂e avoided, car equivalents — ready for your ESG disclosures.",
              },
            ].map(({ step, icon, title, body }) => (
              <div
                key={step}
                className="relative rounded-2xl bg-white border border-green-primary/10 p-8 text-left shadow-sm"
              >
                <div className="absolute -top-4 left-8 flex size-8 items-center justify-center rounded-full bg-green-primary text-xs font-bold text-white">
                  {step}
                </div>
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-display text-xl font-bold text-green-deep mb-2">{title}</h3>
                <p className="text-sm leading-relaxed text-soil/70" dangerouslySetInnerHTML={{ __html: body }} />
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/services"
              className="inline-block rounded-full border border-green-primary px-6 py-3 text-sm font-semibold text-green-primary hover:bg-green-primary hover:text-white transition-colors"
            >
              See full service details →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. WILLOWBANK CLOSED-LOOP CASE STUDY ───────────────────────────── */}
      <section className="bg-green-deep text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-leaf mb-3">
                Flagship case study
              </p>
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl leading-tight">
                Willowbank&apos;s full-circle story
              </h2>
              <p className="mt-5 text-white/80 leading-relaxed">
                Willowbank Wildlife Reserve generates food &amp; green waste every day. We collect it,
                recycle it through our compost worms into premium vermicast, and it becomes{" "}
                <strong className="text-white">Uncle Bob&apos;s plant food</strong> — sold back in
                Willowbank&apos;s own souvenir shop.
              </p>
              <p className="mt-4 text-white/80 leading-relaxed">
                Their waste literally returns to them as a premium retail product. That&apos;s not
                just recycling — that&apos;s regeneration.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-block rounded-full bg-green-leaf px-6 py-3 text-sm font-bold text-soil hover:bg-green-primary hover:text-white transition-colors"
              >
                Build your own closed loop →
              </Link>
            </div>

            {/* Closed-loop visual */}
            <div className="flex justify-center">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80">
                {/* Circle */}
                <div className="absolute inset-0 rounded-full border-4 border-green-leaf/30" />
                {[
                  { label: "Food Waste", sublabel: "Willowbank generates", angle: 0, color: "bg-white/10" },
                  { label: "Collect & Recycle", sublabel: "Hungry Worms picks up", angle: 90, color: "bg-green-primary/40" },
                  { label: "Worm Castings", sublabel: "Premium plant food", angle: 180, color: "bg-green-leaf/20" },
                  { label: "In-store Product", sublabel: "Sold at Willowbank shop", angle: 270, color: "bg-cta/20" },
                ].map(({ label, sublabel, angle, color }) => {
                  const rad = ((angle - 90) * Math.PI) / 180;
                  const r = 112;
                  const x = 50 + (r / 160) * 50 * Math.cos(rad);
                  const y = 50 + (r / 160) * 50 * Math.sin(rad);
                  return (
                    <div
                      key={label}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-xl ${color} border border-white/20 px-3 py-2 text-center backdrop-blur-sm`}
                      style={{ left: `${x}%`, top: `${y}%`, width: "120px" }}
                    >
                      <div className="text-xs font-bold text-white">{label}</div>
                      <div className="text-[10px] text-white/60 mt-0.5">{sublabel}</div>
                    </div>
                  );
                })}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl">🔄</div>
                    <div className="text-xs font-bold text-green-leaf mt-1">Full Circle</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. SUDIMA IMPACT + TESTIMONIAL ─────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Stat card */}
            <div className="rounded-2xl bg-green-primary/5 border border-green-primary/20 p-8 sm:p-10">
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
                <div className="size-10 rounded-full bg-green-primary/20 flex items-center justify-center text-green-deep font-bold text-sm">RP</div>
                <div>
                  <div className="text-sm font-semibold text-soil">Rajas Patil</div>
                  <div className="text-xs text-soil/60">Hotel General Manager, Sudima Christchurch Airport</div>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div>
              <svg className="size-10 text-green-primary/30 mb-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <blockquote className="text-xl leading-relaxed text-soil font-medium italic">
                &ldquo;Hungry Worms is making food waste recycling effortless, seamlessly integrating
                it into our operations. They are playing a key role in helping us achieve our ESG
                goals, including offsetting emissions from our vehicle fleet. More than a service
                provider, they are a true sustainability partner.&rdquo;
              </blockquote>
              <p className="mt-5 text-sm font-semibold text-green-primary">— Rajas Patil, Sudima Christchurch Airport</p>
              <Link
                href="/contact"
                className="mt-8 inline-block rounded-full bg-green-primary px-6 py-3 text-sm font-semibold text-white hover:bg-green-deep transition-colors"
              >
                Get your impact report →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. WHY BUSINESSES CHOOSE US ────────────────────────────────────── */}
      <section className="bg-offwhite py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-extrabold text-soil sm:text-4xl">
              Why Canterbury businesses choose us
            </h2>
            <p className="mt-3 text-soil/60">
              From cafés to rest homes to hotels — we make sustainability practical.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_US.map(({ icon, title, body }) => (
              <div key={title} className="rounded-2xl bg-white border border-green-primary/10 p-6 shadow-sm">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-display font-bold text-green-deep text-lg mb-2">{title}</h3>
                <p className="text-sm leading-relaxed text-soil/70">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-cta px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-cta-dark transition-colors"
            >
              Book a free consultation
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. FROM WASTE TO RESOURCE — UNCLE BOB'S ─────────────────────────── */}
      <section className="bg-green-primary text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
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
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-green-deep hover:bg-green-leaf hover:text-soil transition-colors"
              >
                Shop Uncle Bob&apos;s ↗
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {UNCLEBOBS_PRODUCTS.map((product) => (
                <div
                  key={product}
                  className="rounded-xl bg-white/10 border border-white/20 p-5 text-sm font-semibold text-white"
                >
                  <div className="text-2xl mb-2">🌱</div>
                  {product}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. FINAL CTA BAND ──────────────────────────────────────────────── */}
      <section className="bg-soil text-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl leading-tight">
            Ready to start your sustainability journey?
          </h2>
          <p className="mt-4 text-white/70 text-lg leading-relaxed">
            Join the Canterbury businesses already diverting tonnes from landfill and earning
            real ESG credentials. Your free trial starts with a single conversation.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-cta px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-cta-dark transition-colors"
            >
              Start a Free Trial
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              Talk to us
            </Link>
          </div>
          <p className="mt-5 text-xs text-white/40">
            No commitment required. 99% of trial clients become long-term partners.
          </p>
        </div>
      </section>
    </>
  );
}

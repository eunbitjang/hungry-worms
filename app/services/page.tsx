import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { PARTNERS } from "@/lib/partners";
import { MEDIA } from "@/lib/media";
import Icon, { type IconName } from "../components/Icon";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "Commercial Waste Collection & Recycling Services",
  description:
    "Canterbury's most trusted commercial food & green-waste recycling service. Tailored plans, free trial, and full ESG reporting. Start today.",
  openGraph: {
    title: "Commercial Waste Collection & Recycling Services | Hungry Worms",
    description:
      "Canterbury's most trusted commercial food & green-waste recycling service. Tailored plans, free trial, and full ESG reporting. Start today.",
    url: "/services",
  },
  alternates: { canonical: "/services" },
};

const HOW_IT_WORKS: { step: number; icon: IconName; title: string; body: string }[] = [
  {
    step: 1,
    icon: "bin",
    title: "Dedicated bins at your site",
    body: "We supply and brand your bins — the right size for your volume. Your team separates approved food & green waste; we handle everything else.",
  },
  {
    step: 2,
    icon: "chef",
    title: "Easy waste disposal",
    body: "Staff place food scraps, coffee grounds, eggshells, and green waste in the bins. No specialist training needed — we provide simple how-to signage.",
  },
  {
    step: 3,
    icon: "truck",
    title: "Scheduled pick-up & bin swap",
    body: "We arrive on schedule, collect your full bins, and leave clean, sanitised replacements. Your kitchen stays clean and your operations stay uninterrupted.",
  },
  {
    step: 4,
    icon: "worm",
    title: "Professional recycling",
    body: "Your waste is processed through industrial composting and compost worms — maximising landfill diversion and minimising emissions. Nothing goes to waste.",
  },
  {
    step: 5,
    icon: "chart",
    title: "Impact reporting",
    body: "Monthly and annual reports delivered to your inbox: kg diverted, CO₂e avoided, car equivalents — everything you need for ESG disclosures and sustainability KPIs.",
  },
];

const ADDITIONAL_SERVICES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "factory",
    title: "On-site Composter Implementation",
    body: "We design, install, and manage an on-site food waste composting solution — ideal for large venues or sites wanting zero transport emissions.",
  },
  {
    icon: "wrench",
    title: "Composter Machine Leasing",
    body: "Lease industrial composting equipment with maintenance and team training included. Expand your recycling capability without capital outlay.",
  },
  {
    icon: "leaf",
    title: "All-Natural Fertiliser Supply",
    body: "Buy back the finished product — Uncle Bob's premium worm castings and 100% natural fertiliser, made from recycled food waste. Close your own loop.",
  },
];

const PLAN_INCLUDES = [
  "Branded waste bins supplied and maintained",
  "Scheduled collection on your terms",
  "Clean, sanitised bin replacement every visit",
  "Staff onboarding material included",
  "Monthly ESG impact reports",
  "Annual sustainability summary",
  "Direct access to your account manager",
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-green-deep text-white py-20 lg:py-24 bg-grain">
        {MEDIA.kitchenOverhead && (
          <Image
            src={MEDIA.kitchenOverhead}
            alt=""
            fill
            priority
            sizes="100vw"
            aria-hidden="true"
            className="object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-green-deep/95 via-green-deep/85 to-green-deep/55" aria-hidden="true" />
        <div className="absolute inset-0 bg-mesh opacity-80" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-leaf backdrop-blur-sm">
              Services
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
              Commercial waste pick-up &amp; recycling
            </h1>
            <p className="mt-5 text-white/75 text-lg leading-relaxed">
              For any Canterbury business generating organic waste — cafés, restaurants, rest homes,
              hotels, offices, schools, and community facilities. We handle it all.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-cta px-7 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-cta)] hover:bg-cta-dark transition-all hover:gap-3"
              >
                Start a Free Trial
                <Icon name="arrow-right" className="size-4" />
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                Get a tailored plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative overflow-hidden bg-offwhite bg-dots py-20 lg:py-24">
        <div className="pointer-events-none absolute -top-20 right-0 size-72 rounded-full bg-green-leaf/10 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-green-primary">The process</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-soil sm:text-4xl">How it works</h2>
            <p className="mt-3 text-soil/55">Five straightforward steps — and we handle four of them.</p>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {HOW_IT_WORKS.map(({ step, icon, title, body }, i) => (
              <Reveal key={step} delay={i * 90}>
                <div className="card-lift group h-full rounded-2xl bg-white border border-soil/8 p-6 shadow-[var(--shadow-card)]">
                  <div className="flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-green-primary/10 text-green-primary transition-colors group-hover:bg-green-primary group-hover:text-white">
                      <Icon name={icon} className="size-6" />
                    </div>
                    <span className="font-display text-3xl font-extrabold text-green-primary/12 select-none">{step}</span>
                  </div>
                  <h3 className="mt-4 font-display font-bold text-green-deep text-base">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-soil/65">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Free trial */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-widest text-cta mb-3">No commitment required</p>
              <h2 className="font-display text-3xl font-extrabold text-soil sm:text-4xl leading-tight">
                Start with a free trial.
              </h2>
              <p className="mt-5 text-soil/70 leading-relaxed text-lg">
                We believe our service speaks for itself — which is why we offer a no-obligation
                free trial for every new client.
              </p>
              <div className="mt-5 flex items-center gap-4 rounded-2xl bg-gradient-to-br from-green-primary/8 to-green-leaf/5 border border-green-primary/15 p-5">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-green-primary text-white">
                  <Icon name="target" className="size-6" />
                </div>
                <p className="text-green-deep font-semibold">
                  99% of businesses who trial our service choose to continue as long-term partners.
                </p>
              </div>
              <p className="mt-5 text-soil/70 leading-relaxed">
                We&apos;ll tailor the plan to your operations: bin size and count, pick-up frequency,
                reporting format, and staff onboarding. Then we start — and let the results do the talking.
              </p>
            </Reveal>
            <Reveal delay={150} className="rounded-3xl bg-green-deep text-white p-8 sm:p-10 relative overflow-hidden bg-grain">
              <div className="absolute inset-0 bg-mesh opacity-50" aria-hidden="true" />
              <div className="relative">
                <h3 className="font-display font-bold text-xl mb-5">What&apos;s included in your plan</h3>
                <ul className="space-y-3.5">
                  {PLAN_INCLUDES.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/85">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green-leaf/20 text-green-leaf">
                        <Icon name="check" className="size-3.5" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="mt-8 block rounded-full bg-cta text-center py-3.5 text-sm font-bold text-white shadow-[var(--shadow-cta)] hover:bg-cta-dark transition-colors"
                >
                  Start My Free Trial
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Additional services */}
      <section className="relative overflow-hidden bg-offwhite bg-leaf-wash py-20 lg:py-24">
        <div className="pointer-events-none absolute -bottom-24 -left-20 size-80 rounded-full bg-green-primary/8 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-green-primary">Go further</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-soil sm:text-4xl">
              Additional services
            </h2>
            <p className="mt-3 text-soil/55">
              Need more than collection? We can help you go further.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {ADDITIONAL_SERVICES.map(({ icon, title, body }, i) => (
              <Reveal key={title} delay={i * 110}>
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
        </div>
      </section>

      {/* In good company — partner logos + inspirational invite */}
      <section className="relative overflow-hidden bg-green-deep text-white py-20 lg:py-24 bg-grain">
        <div className="absolute inset-0 bg-mesh opacity-70" aria-hidden="true" />
        <div className="absolute -top-24 -right-20 size-80 rounded-full bg-green-leaf/10 blur-3xl animate-drift" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-green-leaf">In good company</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl leading-tight">
              Join our sustainability circle.
            </h2>
            <p className="mt-4 text-white/75 leading-relaxed max-w-2xl mx-auto text-lg">
              Some of New Zealand&apos;s most respected organisations already turn their food waste
              into measurable impact with us. There&apos;s a place for your business in the circle —
              and we&apos;d love for you to be part of it.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-12 flex flex-wrap items-center justify-center gap-5">
            {PARTNERS.map(({ name, logo, scale, url }) =>
              logo ? (
                <a
                  key={name}
                  href={url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} — visit website`}
                  className="card-lift flex h-16 w-40 items-center justify-center overflow-hidden rounded-2xl bg-white px-5 shadow-lg"
                >
                  <div className="relative h-9 w-full">
                    <Image
                      src={logo}
                      alt={name}
                      fill
                      sizes="160px"
                      style={{ objectFit: "contain", transform: scale ? `scale(${scale})` : undefined }}
                    />
                  </div>
                </a>
              ) : (
                <div
                  key={name}
                  className="flex h-16 w-40 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 text-center text-sm font-bold text-white/85 backdrop-blur-sm"
                  title={name}
                >
                  {name}
                </div>
              )
            )}
          </Reveal>
          <Reveal delay={200} className="mt-12">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-cta px-8 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-cta)] hover:bg-cta-dark transition-all hover:gap-3"
            >
              Join the circle — start free
              <Icon name="arrow-right" className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CTA band */}
      <section className="relative overflow-hidden bg-green-primary text-white py-16">
        <div className="absolute -bottom-20 -right-16 size-72 rounded-full bg-green-leaf/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
            Ready to get started?
          </h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            Tell us about your business and we&apos;ll design a plan around your needs — and your budget.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-white px-7 py-3 text-sm font-bold text-green-deep hover:bg-offwhite transition-colors"
            >
              Book a Free Consultation
            </Link>
            <a
              href="tel:02041841840"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <Icon name="phone" className="size-4" />
              020 4184 1840
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

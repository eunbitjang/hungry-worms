import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { MEDIA } from "@/lib/media";
import Icon, { type IconName } from "../components/Icon";
import Reveal from "../components/Reveal";
import VideoFrame from "../components/VideoFrame";

export const metadata: Metadata = {
  title: "Our Process — Food Waste to Plant Food",
  description:
    "Discover how Hungry Worms turns food waste into premium plant food through composting worms. Full-circle recycling, real sustainability science.",
  openGraph: {
    title: "Our Process — Food Waste to Plant Food | Hungry Worms",
    description:
      "Discover how Hungry Worms turns food waste into premium plant food through composting worms. Full-circle recycling, real sustainability science.",
    url: "/process",
  },
  alternates: { canonical: "/process" },
};

const PROCESS_STEPS: {
  step: number;
  icon: IconName;
  title: string;
  body: string;
  ring: string;
  iconBg: string;
  textColor: string;
}[] = [
  {
    step: 1,
    icon: "bin",
    title: "Waste Collection",
    body: "We collect food and green waste from your site on a scheduled basis. Bins are supplied, maintained, and swapped out at every visit — no mess, no hassle for your team.",
    ring: "border-green-primary/20",
    iconBg: "bg-green-primary",
    textColor: "text-green-primary",
  },
  {
    step: 2,
    icon: "worm",
    title: "Natural Breakdown",
    body: "Your waste enters our vermiculture process. Thousands of compost worms convert organic material into premium vermicast — no toxic byproducts, no methane, just nutrition-dense soil amendment.",
    ring: "border-green-deep/20",
    iconBg: "bg-green-deep",
    textColor: "text-green-deep",
  },
  {
    step: 3,
    icon: "factory",
    title: "Industrial Composting",
    body: "Industrial composting machinery accelerates the process for larger volumes, achieving maximum diversion from landfill and cutting the timeline from months to weeks.",
    ring: "border-green-leaf/30",
    iconBg: "bg-green-leaf",
    textColor: "text-green-deep",
  },
  {
    step: 4,
    icon: "leaf",
    title: "Going Full Circle",
    body: "The finished worm castings and compost become the foundation of Uncle Bob's regenerative garden products — sold back to you, your customers, and NZ gardeners. Your waste returns as a premium resource.",
    ring: "border-cta/25",
    iconBg: "bg-cta",
    textColor: "text-cta-dark",
  },
];

const SUSTAINABILITY_FACTS = [
  {
    stat: "~4%",
    label: "of total global GHG emissions",
    body: "come from food and organic waste. It's one of the most impactful — and most overlooked — emission sources.",
    source: "NZ Ministry for the Environment",
  },
  {
    stat: ">2.5 kg",
    label: "CO₂e per kg of food waste",
    body: "For every kilogram of food waste sent to landfill, more than 2.5 kg of greenhouse gas is emitted. Our collection directly prevents this.",
    source: "UN FAO 2013 Food Wastage Footprint",
  },
  {
    stat: "25×",
    label: "more potent than CO₂",
    body: "Methane — the gas produced when food rots in landfill — is 25 times more potent than carbon dioxide as a greenhouse gas. Diverting your waste matters.",
    source: "IPCC",
  },
];

const FULL_CIRCLE: { label: string; icon: IconName }[] = [
  { label: "Your food waste", icon: "utensils" },
  { label: "Collected by us", icon: "truck" },
  { label: "Composted & vermicast", icon: "worm" },
  { label: "Uncle Bob's products", icon: "leaf" },
  { label: "Back to your community", icon: "home" },
];

export default function ProcessPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-green-deep text-white py-20 lg:py-24 bg-grain">
        {MEDIA.wormsInHands && (
          <Image
            src={MEDIA.wormsInHands}
            alt=""
            fill
            priority
            sizes="100vw"
            aria-hidden="true"
            className="object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-green-deep/95 via-green-deep/80 to-green-deep/50" aria-hidden="true" />
        <div className="absolute inset-0 bg-mesh opacity-80" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-leaf backdrop-blur-sm">
              Our Process
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
              Food waste to plant food.<br />
              Saving the environment one bite at a time.
            </h1>
            <p className="mt-5 text-white/75 text-lg leading-relaxed">
              Every kilogram of food waste we collect avoids more than 2.5 kg of greenhouse gas.
              Here&apos;s exactly how that happens.
            </p>
          </div>
        </div>
      </section>

      {/* Process steps */}
      <section className="relative overflow-hidden bg-offwhite bg-dots py-20 lg:py-24">
        <div className="pointer-events-none absolute -top-20 -right-16 size-72 rounded-full bg-green-leaf/10 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="sr-only">Our recycling process</h2>
          <div className="space-y-8">
            {PROCESS_STEPS.map(({ step, icon, title, body, ring, iconBg, textColor }, idx) => (
              <Reveal key={step}>
                <div
                  className={`flex flex-col sm:flex-row ${idx % 2 === 1 ? "sm:flex-row-reverse" : ""} gap-6 sm:gap-8 items-center`}
                >
                  {/* Icon/number badge */}
                  <div className="shrink-0 flex flex-col items-center gap-3">
                    <div className={`flex size-20 items-center justify-center rounded-2xl ${iconBg} text-white shadow-lg`}>
                      <Icon name={icon} className="size-9" />
                    </div>
                    <div className={`text-xs font-bold uppercase tracking-widest ${textColor}`}>Step {step}</div>
                  </div>
                  {/* Content */}
                  <div className={`card-lift rounded-2xl bg-white border ${ring} px-8 py-7 flex-1 shadow-[var(--shadow-card)]`}>
                    <h3 className={`font-display text-xl font-extrabold ${textColor} mb-3`}>{title}</h3>
                    <p className="text-soil/70 leading-relaxed">{body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Behind the scenes — Mark + composting machine video */}
      <section className="relative overflow-hidden bg-green-deep text-white py-20 lg:py-24 bg-grain">
        <div className="absolute inset-0 bg-mesh opacity-70" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-green-leaf">Behind the scenes</span>
              <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl leading-tight">
                See the process in action.
              </h2>
              <p className="mt-5 text-white/75 leading-relaxed">
                Watch our co-founder Mark walk through the composting machine and show what fully
                processed food waste actually looks like — rich, clean, nutrient-dense compost ready
                to begin its second life as premium plant food.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Industrial composting, up close",
                  "From raw food scraps to finished vermicast",
                  "No landfill, no methane, no waste",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-green-leaf/20 text-green-leaf">
                      <Icon name="check" className="size-3.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={150}>
              <VideoFrame
                src={MEDIA.processVideo}
                poster={MEDIA.processPoster}
                caption="Mark at the composting machine — processed food waste, ready to regenerate."
                fallbackIcon="factory"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Sustainability facts */}
      <section className="relative overflow-hidden bg-soil text-white py-20 lg:py-24 bg-grain">
        <div className="absolute inset-0 bg-mesh opacity-30" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-green-leaf">The science</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
              Why food waste matters
            </h2>
            <p className="mt-3 text-white/60">
              The science behind our impact claims — sourced and cited.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {SUSTAINABILITY_FACTS.map(({ stat, label, body, source }, i) => (
              <Reveal key={stat} delay={i * 110}>
                <div className="card-lift h-full rounded-2xl bg-white/5 border border-white/10 p-7 hover:border-green-leaf/30">
                  <div className="font-display text-4xl font-extrabold text-gradient-leaf mb-1">{stat}</div>
                  <div className="text-sm font-semibold text-white/80 mb-3">{label}</div>
                  <p className="text-sm text-white/60 leading-relaxed">{body}</p>
                  <p className="mt-4 text-xs text-white/30 italic">Source: {source}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Full circle visual summary */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-green-primary">Closed loop</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-soil sm:text-4xl">
              The full circle
            </h2>
            <p className="mt-3 text-soil/55 max-w-xl mx-auto">
              We don&apos;t just remove waste. We complete the loop — turning your organic output into
              a local asset.
            </p>
          </Reveal>
          <div className="mt-14 flex flex-wrap justify-center gap-3 items-stretch">
            {FULL_CIRCLE.map(({ label, icon }, i) => (
              <Reveal key={label} delay={i * 90} className="contents">
                <div className="card-lift flex w-32 flex-col items-center gap-3 rounded-2xl bg-offwhite border border-soil/8 px-4 py-5 shadow-[var(--shadow-card)]">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-green-primary/10 text-green-primary">
                    <Icon name={icon} className="size-6" />
                  </span>
                  <span className="text-xs font-semibold text-green-deep text-center leading-snug">{label}</span>
                </div>
                {i < FULL_CIRCLE.length - 1 && (
                  <span className="hidden sm:flex items-center text-green-leaf" aria-hidden="true">
                    <Icon name="arrow-right" className="size-5" />
                  </span>
                )}
              </Reveal>
            ))}
          </div>
          <div className="mt-12">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-green-primary px-8 py-3.5 text-sm font-bold text-white hover:bg-green-deep transition-all hover:gap-3"
            >
              Join the loop — start your free trial
              <Icon name="arrow-right" className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

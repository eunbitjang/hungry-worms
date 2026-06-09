import Link from "next/link";
import type { Metadata } from "next";

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

const PROCESS_STEPS = [
  {
    step: 1,
    icon: "🗑️",
    title: "Waste Collection",
    body: "We collect food and green waste from your site on a scheduled basis. Bins are supplied, maintained, and swapped out at every visit — no mess, no hassle for your team.",
    color: "bg-green-primary/10 border-green-primary/20",
    textColor: "text-green-primary",
  },
  {
    step: 2,
    icon: "🪱",
    title: "Natural Breakdown",
    body: "Your waste enters our vermiculture process. Thousands of compost worms convert organic material into premium vermicast — no toxic byproducts, no methane, just nutrition-dense soil amendment.",
    color: "bg-green-deep/10 border-green-deep/20",
    textColor: "text-green-deep",
  },
  {
    step: 3,
    icon: "🏭",
    title: "Industrial Composting",
    body: "Industrial composting machinery accelerates the process for larger volumes, achieving maximum diversion from landfill and cutting the timeline from months to weeks.",
    color: "bg-green-leaf/10 border-green-leaf/30",
    textColor: "text-green-deep",
  },
  {
    step: 4,
    icon: "🌿",
    title: "Going Full Circle",
    body: "The finished worm castings and compost become the foundation of Uncle Bob's regenerative garden products — sold back to you, your customers, and NZ gardeners. Your waste returns as a premium resource.",
    color: "bg-cta/10 border-cta/20",
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

export default function ProcessPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-green-deep text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-green-leaf mb-3">Our Process</p>
            <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
              Food waste to plant food.<br />
              Saving the environment one bite at a time.
            </h1>
            <p className="mt-5 text-white/80 text-lg leading-relaxed">
              Every kilogram of food waste we collect avoids more than 2.5 kg of greenhouse gas.
              Here&apos;s exactly how that happens.
            </p>
          </div>
        </div>
      </section>

      {/* Process steps */}
      <section className="bg-offwhite py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="sr-only">Our recycling process</h2>
          <div className="space-y-8">
            {PROCESS_STEPS.map(({ step, icon, title, body, color, textColor }, idx) => (
              <div
                key={step}
                className={`flex flex-col sm:flex-row ${idx % 2 === 1 ? "sm:flex-row-reverse" : ""} gap-8 items-center`}
              >
                {/* Icon/number badge */}
                <div className="shrink-0 flex flex-col items-center gap-3">
                  <div className={`flex size-20 items-center justify-center rounded-full ${color} border-2 text-4xl`}>
                    {icon}
                  </div>
                  <div className={`text-xs font-bold uppercase tracking-widest ${textColor}`}>Step {step}</div>
                </div>
                {/* Content */}
                <div className={`rounded-2xl ${color} border px-8 py-7 flex-1 max-w-2xl`}>
                  <h3 className={`font-display text-xl font-extrabold ${textColor} mb-3`}>{title}</h3>
                  <p className="text-soil/75 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability facts */}
      <section className="bg-soil text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
              Why food waste matters
            </h2>
            <p className="mt-3 text-white/60">
              The science behind our impact claims — sourced and cited.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {SUSTAINABILITY_FACTS.map(({ stat, label, body, source }) => (
              <div key={stat} className="rounded-2xl bg-white/5 border border-white/10 p-7">
                <div className="font-display text-4xl font-extrabold text-green-leaf mb-1">{stat}</div>
                <div className="text-sm font-semibold text-white/80 mb-3">{label}</div>
                <p className="text-sm text-white/60 leading-relaxed">{body}</p>
                <p className="mt-4 text-xs text-white/30 italic">Source: {source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full circle visual summary */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-extrabold text-soil sm:text-4xl">
            The full circle
          </h2>
          <p className="mt-3 text-soil/60 max-w-xl mx-auto">
            We don&apos;t just remove waste. We complete the loop — turning your organic output into
            a local asset.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-3 items-center">
            {[
              { label: "Your food waste", icon: "🍽️" },
              { label: "→", icon: null },
              { label: "Collected by us", icon: "🚛" },
              { label: "→", icon: null },
              { label: "Composted & vermicast", icon: "🪱" },
              { label: "→", icon: null },
              { label: "Uncle Bob's products", icon: "🌿" },
              { label: "→", icon: null },
              { label: "Back to your community", icon: "🏡" },
            ].map(({ label, icon }, i) =>
              icon ? (
                <div key={i} className="flex flex-col items-center gap-1 rounded-xl bg-green-primary/5 border border-green-primary/10 px-4 py-3 min-w-[110px]">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-xs font-semibold text-green-deep text-center">{label}</span>
                </div>
              ) : (
                <span key={i} className="text-2xl text-green-leaf font-bold">{label}</span>
              )
            )}
          </div>
          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-green-primary px-8 py-3.5 text-sm font-bold text-white hover:bg-green-deep transition-colors"
            >
              Join the loop — start your free trial
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

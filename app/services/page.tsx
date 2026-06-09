import Link from "next/link";
import type { Metadata } from "next";

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

const HOW_IT_WORKS = [
  {
    step: 1,
    icon: "🗑️",
    title: "Dedicated bins at your site",
    body: "We supply and brand your bins — the right size for your volume. Your team separates approved food & green waste; we handle everything else.",
  },
  {
    step: 2,
    icon: "🧑‍🍳",
    title: "Easy waste disposal",
    body: "Staff place food scraps, coffee grounds, eggshells, and green waste in the bins. No specialist training needed — we provide simple how-to signage.",
  },
  {
    step: 3,
    icon: "🚛",
    title: "Scheduled pick-up & bin swap",
    body: "We arrive on schedule, collect your full bins, and leave clean, sanitised replacements. Your kitchen stays clean and your operations stay uninterrupted.",
  },
  {
    step: 4,
    icon: "🪱",
    title: "Professional recycling",
    body: "Your waste is processed through industrial composting and compost worms — maximising landfill diversion and minimising emissions. Nothing goes to waste.",
  },
  {
    step: 5,
    icon: "📊",
    title: "Impact reporting",
    body: "Monthly and annual reports delivered to your inbox: kg diverted, CO₂e avoided, car equivalents — everything you need for ESG disclosures and sustainability KPIs.",
  },
];

const ADDITIONAL_SERVICES = [
  {
    icon: "🏗️",
    title: "On-site Composter Implementation",
    body: "We design, install, and manage an on-site food waste composting solution — ideal for large venues or sites wanting zero transport emissions.",
  },
  {
    icon: "🔧",
    title: "Composter Machine Leasing",
    body: "Lease industrial composting equipment with maintenance and team training included. Expand your recycling capability without capital outlay.",
  },
  {
    icon: "🌿",
    title: "All-Natural Fertiliser Supply",
    body: "Buy back the finished product — Uncle Bob's premium worm castings and plant food, made from recycled food waste. Close your own loop.",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-green-deep text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-green-leaf mb-3">Services</p>
            <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
              Commercial waste pick-up &amp; recycling
            </h1>
            <p className="mt-5 text-white/80 text-lg leading-relaxed">
              For any Canterbury business generating organic waste — cafés, restaurants, rest homes,
              hotels, offices, schools, and community facilities. We handle it all.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-cta px-7 py-3.5 text-sm font-bold text-white hover:bg-cta-dark transition-colors"
              >
                Start a Free Trial
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
              >
                Get a tailored plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-offwhite py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="font-display text-3xl font-extrabold text-soil sm:text-4xl">How it works</h2>
            <p className="mt-3 text-soil/60">Five straightforward steps — and we handle four of them.</p>
          </div>
          <div className="relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-14 left-0 right-0 h-0.5 bg-green-primary/15 mx-24" aria-hidden="true" />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {HOW_IT_WORKS.map(({ step, icon, title, body }) => (
                <div key={step} className="relative">
                  <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                    <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-green-primary text-white font-display font-bold text-lg mb-4 shadow-md">
                      {step}
                    </div>
                    <div className="text-3xl mb-3">{icon}</div>
                    <h3 className="font-display font-bold text-green-deep text-base mb-2">{title}</h3>
                    <p className="text-sm leading-relaxed text-soil/70">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Free trial */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-cta mb-3">No commitment required</p>
              <h2 className="font-display text-3xl font-extrabold text-soil sm:text-4xl leading-tight">
                Start with a free trial.
              </h2>
              <p className="mt-5 text-soil/70 leading-relaxed text-lg">
                We believe our service speaks for itself — which is why we offer a no-obligation
                free trial for every new client.
              </p>
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-green-primary/5 border border-green-primary/20 p-5">
                <div className="text-4xl">🎯</div>
                <p className="text-green-deep font-semibold">
                  99% of businesses who trial our service choose to continue as long-term partners.
                </p>
              </div>
              <p className="mt-5 text-soil/70 leading-relaxed">
                We&apos;ll tailor the plan to your operations: bin size and count, pick-up frequency,
                reporting format, and staff onboarding. Then we start — and let the results do the talking.
              </p>
            </div>
            <div className="rounded-2xl bg-green-deep text-white p-8 sm:p-10">
              <h3 className="font-display font-bold text-xl mb-5">What&apos;s included in your plan</h3>
              <ul className="space-y-4">
                {[
                  "Branded waste bins supplied and maintained",
                  "Scheduled collection on your terms",
                  "Clean, sanitised bin replacement every visit",
                  "Staff onboarding material included",
                  "Monthly ESG impact reports",
                  "Annual sustainability summary",
                  "Direct access to your account manager",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/85">
                    <span className="mt-0.5 text-green-leaf font-bold shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="mt-8 block rounded-full bg-cta text-center py-3.5 text-sm font-bold text-white hover:bg-cta-dark transition-colors"
              >
                Start My Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Additional services */}
      <section className="bg-offwhite py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-extrabold text-soil sm:text-4xl">
              Additional services
            </h2>
            <p className="mt-3 text-soil/60">
              Need more than collection? We can help you go further.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {ADDITIONAL_SERVICES.map(({ icon, title, body }) => (
              <div key={title} className="rounded-2xl bg-white border border-green-primary/10 p-7 shadow-sm">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-display font-bold text-green-deep text-lg mb-2">{title}</h3>
                <p className="text-sm leading-relaxed text-soil/70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-green-primary text-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
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
              className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              020 4184 1840
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

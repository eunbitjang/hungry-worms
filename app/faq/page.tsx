import type { Metadata } from "next";
import Link from "next/link";
import Icon from "../components/Icon";
import { UNCLE_BOBS } from "@/lib/links";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about Hungry Worms' commercial food & green-waste recycling — trials, accepted waste, impact reporting, the client portal, and more.",
  alternates: { canonical: "/faq" },
};

type QA = { q: string; a: string };
type Section = { title: string; items: QA[] };

const FAQ: Section[] = [
  {
    title: "Getting started",
    items: [
      {
        q: "What does Hungry Worms do?",
        a: "We provide full-circle commercial food & green-waste recycling across Canterbury. We collect your organic waste, recycle it through compost worms and industrial composting, and give you measurable impact reports — keeping your waste out of landfill and turning it into premium, 100% natural fertiliser.",
      },
      {
        q: "Who is your service for?",
        a: "Any Canterbury business that generates organic waste — cafés, restaurants, hotels, rest homes, offices, schools, and community facilities. Whether you produce a little or a lot, we can tailor a plan to suit.",
      },
      {
        q: "What areas do you service?",
        a: "We operate throughout Canterbury, including Christchurch and surrounding areas. If you're not sure whether we cover your location, get in touch and we'll let you know.",
      },
      {
        q: "How do I get started?",
        a: "Contact us and we'll tailor a plan to your operations — bin size and count, pickup frequency, and reporting format — then get you set up. You can start with a one-month trial, or go straight to an ongoing service; most clients decide after one conversation.",
      },
    ],
  },
  {
    title: "How it works",
    items: [
      {
        q: "How does the service work?",
        a: "It's three simple steps: we Collect your food & green waste on a schedule, Recycle it through compost worms and industrial composting, and Report your impact back to you. We supply and maintain the bins and handle every pickup — no disruption to your team.",
      },
      {
        q: "Do you provide the bins?",
        a: "Yes. We supply branded bins sized to your volume. At every visit we collect your full bins and leave clean, sanitised replacements, so your kitchen stays tidy and hygienic.",
      },
      {
        q: "How often do you collect?",
        a: "Collection is scheduled around your needs and volume. We'll agree a frequency with you when we set up your plan, and adjust it as your needs change.",
      },
      {
        q: "Does my team need special training?",
        a: "No specialist training is needed. Staff simply place approved food and green waste in the bins. We provide simple how-to signage to make it easy for everyone.",
      },
    ],
  },
  {
    title: "Your waste",
    items: [
      {
        q: "What can go in the bins?",
        a: "Food scraps, coffee grounds, eggshells, fruit and vegetable peelings, and green waste. When we set up your plan we'll confirm exactly what's accepted for your site.",
      },
      {
        q: "What happens to my waste?",
        a: "Your waste is processed through vermiculture (thousands of compost worms) and industrial composting. It becomes premium vermicast and compost — the foundation of Uncle Bob's regenerative garden products. Nothing we collect goes to landfill.",
      },
      {
        q: "Why does diverting food waste matter?",
        a: "When food waste rots in landfill it produces methane — a greenhouse gas around 25× more potent than CO₂. For every kilogram of food waste, more than 2.5 kg of CO₂e is emitted. Recycling your organic waste directly prevents these emissions.",
      },
    ],
  },
  {
    title: "Impact & reporting",
    items: [
      {
        q: "Will I receive impact reports?",
        a: "Yes. You'll get monthly and annual reports showing kilograms of waste diverted, CO₂e emissions avoided, and car-equivalents — everything you need for sustainability tracking.",
      },
      {
        q: "Can I use this for ESG reporting?",
        a: "Absolutely. Our reports are designed to support ESG disclosures, sustainability commitments, investor decks, and council reporting with real, measurable numbers.",
      },
      {
        q: "What is the client portal?",
        a: "The client portal is your secure online dashboard. Sign in to see your organisation's live impact data, track trends over time, and export your figures as PDF or CSV. Each client can only see their own data.",
      },
      {
        q: "How is my impact calculated?",
        a: "We base our figures on recognised methodology: more than 2.5 kg of CO₂e is avoided for every kilogram of food waste diverted from landfill. Your totals are calculated from the actual weight we collect.",
      },
    ],
  },
  {
    title: "Trial, pricing & products",
    items: [
      {
        q: "Do you offer a trial?",
        a: "Yes — a one-month trial, charged at the normal rate, with no long-term commitment. Run it for a month, then either carry on or wind it up; there's no exit fee and nothing to sign in advance. In practice most clients skip it and start the ongoing service straight after our first meeting.",
      },
      {
        q: "How much does it cost?",
        a: "Plans are tailored to your operations, so pricing depends on factors like volume, pickup frequency, and any additional services. Contact us for a tailored quote.",
      },
      {
        q: "Where can I buy composting worms?",
        a: "You're in the right place — but the worms are sold through our sister shop, Uncle Bob's. Hungry Worms runs the commercial waste-collection side; the live composting worms (and the garden products made from the waste we recycle) are sold at unclebobs.co.nz, with delivery nationwide. Just head to unclebobs.co.nz to order.",
      },
      {
        q: "What is Uncle Bob's?",
        a: "Uncle Bob's is our sister brand of regenerative garden products — 100% natural, NZ-made fertiliser and live composting worms created from the waste we recycle. It's the final step in the full circle, and the products are available nationwide at unclebobs.co.nz.",
      },
    ],
  },
];

// FAQ structured data for search engines
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.flatMap((s) =>
    s.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    }))
  ),
};

// Answers are stored as plain strings (so the FAQPage JSON-LD above stays plain
// text, which is what search engines want). For display we linkify the
// unclebobs.co.nz mentions so visitors can click straight through to the shop.
const LINK_CLASS =
  "font-semibold text-green-primary underline underline-offset-2 hover:text-green-deep transition-colors";

const ANSWER_LINKS: { match: string; render: (key: string) => React.ReactNode }[] = [
  {
    match: "unclebobs.co.nz",
    render: (key) => (
      <a key={key} href={UNCLE_BOBS.shop} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
        unclebobs.co.nz
      </a>
    ),
  },
];

function renderAnswer(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let rest = text;
  let i = 0;
  while (rest.length > 0) {
    let earliest: { idx: number; link: (typeof ANSWER_LINKS)[number] } | null = null;
    for (const link of ANSWER_LINKS) {
      const idx = rest.indexOf(link.match);
      if (idx !== -1 && (earliest === null || idx < earliest.idx)) {
        earliest = { idx, link };
      }
    }
    if (!earliest) {
      nodes.push(rest);
      break;
    }
    if (earliest.idx > 0) nodes.push(rest.slice(0, earliest.idx));
    nodes.push(earliest.link.render(`l${i++}`));
    rest = rest.slice(earliest.idx + earliest.link.match.length);
  }
  return nodes;
}

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-green-deep text-white py-16 lg:py-20 bg-grain">
        <div className="absolute inset-0 bg-mesh" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-leaf backdrop-blur-sm">
            Help
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mt-4 text-white/75 text-lg leading-relaxed">
            Everything you need to know about recycling your food & green waste with us. Can&apos;t
            find your answer? We&apos;re happy to help.
          </p>
        </div>
      </section>

      {/* FAQ content */}
      <section className="relative overflow-hidden bg-offwhite bg-dots py-16 lg:py-20">
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-12">
          {FAQ.map((section) => (
            <div key={section.title}>
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-green-primary mb-5">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.items.map(({ q, a }) => (
                  <details
                    key={q}
                    className="group card-lift rounded-2xl bg-white border border-soil/8 shadow-[var(--shadow-card)] open:shadow-[var(--shadow-card-hover)]"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6">
                      <span className="font-display font-bold text-green-deep">{q}</span>
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-green-primary/10 text-green-primary transition-transform duration-300 group-open:rotate-45">
                        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </summary>
                    <p className="px-5 pb-5 sm:px-6 sm:pb-6 -mt-1 text-soil/70 leading-relaxed">{renderAnswer(a)}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-green-primary text-white py-16">
        <div className="absolute -bottom-20 -left-16 size-72 rounded-full bg-green-leaf/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Still have questions?</h2>
          <p className="mt-3 text-white/80">
            Talk to our team — or start your one-month trial today.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-green-deep hover:bg-green-leaf hover:text-soil transition-all hover:gap-3"
            >
              Contact us
              <Icon name="arrow-right" className="size-4" />
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              See our services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

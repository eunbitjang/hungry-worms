import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Our Mission, Vision & Team",
  description:
    "Meet the Hungry Worms team. Canterbury-based, nature-powered, and committed to making sustainability practical for every NZ business.",
  openGraph: {
    title: "About Us — Our Mission, Vision & Team | Hungry Worms",
    description:
      "Meet the Hungry Worms team. Canterbury-based, nature-powered, and committed to making sustainability practical for every NZ business.",
    url: "/about",
  },
  alternates: { canonical: "/about" },
};

const TEAM = [
  {
    name: "Mark Groufsky",
    role: "Co-Founder",
    initials: "MG",
  },
  {
    name: "Juline Grassam",
    role: "Co-Founder",
    initials: "JG",
  },
  {
    name: "David Lim",
    role: "Business Development Manager",
    initials: "DL",
  },
  {
    name: "Ian Lamb",
    role: "Head of Regenerative Farming",
    initials: "IL",
  },
  {
    name: "Mido Jang",
    role: "Strategic Communications Lead",
    initials: "MJ",
  },
  {
    name: "Tim Lamb",
    role: "Digital Marketing Lead",
    initials: "TL",
  },
];

const VALUES = [
  {
    icon: "🌿",
    title: "Environmentally sustainable",
    body: "Every decision we make prioritises the natural environment — from how we collect, to what we create.",
  },
  {
    icon: "🤝",
    title: "Socially sustainable",
    body: "We build genuine partnerships with local businesses, creating shared value for Canterbury communities.",
  },
  {
    icon: "💼",
    title: "Financially viable",
    body: "Sustainability has to make business sense. Our model is designed to be affordable, measurable, and scalable.",
  },
  {
    icon: "🔄",
    title: "Closed-loop by design",
    body: "We don't just remove waste — we complete the loop. Your food waste returns as premium soil and plant food.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-green-deep text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-green-leaf mb-3">About Us</p>
            <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
              We are committed to helping you reach your sustainability goals.
            </h1>
            <p className="mt-5 text-white/80 text-lg leading-relaxed">
              Hungry Worms is Canterbury&apos;s leading full-circle food &amp; green-waste recycling
              company. We educate, innovate, and deliver sustainability solutions that are practical,
              local, and measurable.
            </p>
          </div>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="bg-offwhite py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="rounded-2xl bg-white border border-green-primary/10 p-8 sm:p-10 shadow-sm">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="font-display text-2xl font-extrabold text-green-deep mb-4">Our Mission</h2>
              <p className="text-soil/75 leading-relaxed">
                To be a leading innovator in full-circle food waste recycling in New Zealand — educating
                businesses and communities on sustainability while delivering solutions that are
                environmentally sustainable, socially beneficial, financially viable, and genuinely achievable.
              </p>
            </div>
            <div className="rounded-2xl bg-green-primary text-white p-8 sm:p-10 shadow-sm">
              <div className="text-4xl mb-4">🌱</div>
              <h2 className="font-display text-2xl font-extrabold mb-4">Our Vision</h2>
              <p className="leading-relaxed text-white/85">
                <em>&ldquo;From Food Waste to Local Regeneration — Powered by Nature.&rdquo;</em>
              </p>
              <p className="mt-4 text-white/75 leading-relaxed">
                Sustainability should be practical, local, and measurable. We&apos;re building closed-loop
                food systems powered by nature — turning Canterbury&apos;s waste into Canterbury&apos;s
                soil, one pickup at a time.
              </p>
            </div>
          </div>

          {/* Approach */}
          <div className="mt-8 rounded-2xl bg-soil text-white p-8 sm:p-10">
            <h2 className="font-display text-2xl font-extrabold mb-4">Our Approach</h2>
            <p className="text-white/80 leading-relaxed max-w-3xl">
              We partner with local businesses to minimise their food waste and lower their carbon
              footprint. By combining industrial composting with vermiculture (compost worms), we achieve
              the highest possible diversion rate from landfill — and create eco-friendly garden products
              that return value to the community. We keep the Google Sheet, the worm farm, and the
              ESG report in the same story.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-extrabold text-soil sm:text-4xl">What drives us</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon, title, body }) => (
              <div key={title} className="rounded-2xl bg-green-primary/5 border border-green-primary/10 p-6">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-display font-bold text-green-deep text-base mb-2">{title}</h3>
                <p className="text-sm leading-relaxed text-soil/70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-offwhite py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-extrabold text-soil sm:text-4xl">Meet the team</h2>
            <p className="mt-3 text-soil/60">
              Canterbury locals, sustainability advocates, and worm enthusiasts.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {TEAM.map(({ name, role, initials }) => (
              <div key={name} className="text-center">
                {/* Avatar placeholder — replace with <Image> when photos supplied */}
                <div className="mx-auto size-20 rounded-full bg-green-deep flex items-center justify-center text-white font-display font-bold text-lg mb-3 shadow-md">
                  {initials}
                </div>
                <div className="font-semibold text-soil text-sm">{name}</div>
                <div className="text-xs text-soil/55 mt-0.5 leading-snug">{role}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-soil/40 italic">
            Team photo assets — supply headshots to replace initials
          </p>
        </div>
      </section>

      {/* Uncle Bob's callout */}
      <section className="bg-green-primary text-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
            Our sister brand: Uncle Bob&apos;s Regenerative Garden Products
          </h2>
          <p className="mt-4 text-white/75 leading-relaxed">
            The finished output of our recycling process becomes Uncle Bob&apos;s premium, 100% natural,
            NZ-made plant food. Available online and in selected retailers nationwide.
          </p>
          <a
            href="https://www.unclebobs.co.nz/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-block rounded-full bg-white px-7 py-3 text-sm font-bold text-green-deep hover:bg-green-leaf hover:text-soil transition-colors"
          >
            Visit unclebobs.co.nz ↗
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-soil text-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
            Want to work with us?
          </h2>
          <p className="mt-3 text-white/70">Start with a free trial or get in touch to learn more.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-cta px-7 py-3 text-sm font-bold text-white hover:bg-cta-dark transition-colors"
            >
              Start a Free Trial
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

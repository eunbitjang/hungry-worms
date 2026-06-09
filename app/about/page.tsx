import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Icon, { type IconName } from "../components/Icon";
import Reveal from "../components/Reveal";
import { MEDIA } from "@/lib/media";

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
  { name: "Mark Groufsky", role: "Co-Founder" },
  { name: "Juline Grassam", role: "Co-Founder" },
  { name: "David Lim", role: "Business Development Manager" },
  { name: "Ian Lamb", role: "Head of Regenerative Farming" },
  { name: "Mido Jang", role: "Strategic Communications Lead" },
  { name: "Tim Lamb", role: "Digital Marketing Lead" },
];

const VALUES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "leaf",
    title: "Environmentally sustainable",
    body: "Every decision we make prioritises the natural environment — from how we collect, to what we create.",
  },
  {
    icon: "home",
    title: "Socially sustainable",
    body: "We build genuine partnerships with local businesses, creating shared value for Canterbury communities.",
  },
  {
    icon: "chart",
    title: "Financially viable",
    body: "Sustainability has to make business sense. Our model is designed to be affordable, measurable, and scalable.",
  },
  {
    icon: "cycle",
    title: "Closed-loop by design",
    body: "We don't just remove waste — we complete the loop. Your food waste returns as premium soil and 100% natural fertiliser.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-green-deep text-white py-20 lg:py-24 bg-grain">
        <div className="absolute inset-0 bg-mesh" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-leaf backdrop-blur-sm">
              About Us
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
              We are committed to helping you reach your sustainability goals.
            </h1>
            <p className="mt-5 text-white/75 text-lg leading-relaxed">
              Hungry Worms is Canterbury&apos;s leading full-circle food &amp; green-waste recycling
              company. We educate, innovate, and deliver sustainability solutions that are practical,
              local, and measurable.
            </p>
          </div>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="bg-offwhite py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Reveal className="card-lift rounded-3xl bg-white border border-soil/8 p-8 sm:p-10 shadow-[var(--shadow-card)]">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-green-primary/10 text-green-primary">
                <Icon name="target" className="size-7" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-extrabold text-green-deep mb-4">Our Mission</h2>
              <p className="text-soil/70 leading-relaxed">
                To be a leading innovator in full-circle food waste recycling in New Zealand — educating
                businesses and communities on sustainability while delivering solutions that are
                environmentally sustainable, socially beneficial, financially viable, and genuinely achievable.
              </p>
            </Reveal>
            <Reveal delay={120} className="relative overflow-hidden rounded-3xl bg-green-primary text-white p-8 sm:p-10 shadow-[var(--shadow-card)] bg-grain">
              <div className="absolute -top-16 -right-16 size-56 rounded-full bg-green-leaf/15 blur-2xl" aria-hidden="true" />
              <div className="relative">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15 text-green-leaf">
                  <Icon name="sprout" className="size-7" />
                </div>
                <h2 className="mt-5 font-display text-2xl font-extrabold mb-4">Our Vision</h2>
                <p className="leading-relaxed text-white/90 text-lg">
                  <em>&ldquo;From Food Waste to Local Regeneration — Powered by Nature.&rdquo;</em>
                </p>
                <p className="mt-4 text-white/75 leading-relaxed">
                  Sustainability should be practical, local, and measurable. We&apos;re building closed-loop
                  food systems powered by nature — turning Canterbury&apos;s waste into Canterbury&apos;s
                  soil, one pickup at a time.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Approach */}
          <Reveal className="mt-8 relative overflow-hidden rounded-3xl bg-soil text-white p-8 sm:p-10 bg-grain">
            <div className="absolute inset-0 bg-mesh opacity-25" aria-hidden="true" />
            <div className="relative">
              <h2 className="font-display text-2xl font-extrabold mb-4">Our Approach</h2>
              <p className="text-white/80 leading-relaxed max-w-3xl">
                We partner with local businesses to minimise their food waste and lower their carbon
                footprint. By combining industrial composting with vermiculture (compost worms), we achieve
                the highest possible diversion rate from landfill — and create eco-friendly garden products
                that return value to the community. We keep the Google Sheet, the worm farm, and the
                ESG report in the same story.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-green-primary">Our values</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-soil sm:text-4xl">What drives us</h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon, title, body }, i) => (
              <Reveal key={title} delay={i * 100}>
                <div className="card-lift group h-full rounded-2xl bg-offwhite border border-soil/8 p-6 shadow-[var(--shadow-card)]">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-green-primary/10 text-green-primary transition-colors group-hover:bg-green-primary group-hover:text-white">
                    <Icon name={icon} className="size-6" />
                  </div>
                  <h3 className="mt-5 font-display font-bold text-green-deep text-base">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-soil/65">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-offwhite py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-green-primary">The people</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-soil sm:text-4xl">Meet the team</h2>
            <p className="mt-3 text-soil/55">
              Canterbury locals, sustainability advocates, and worm enthusiasts.
            </p>
          </Reveal>
          {/* Group photo — kept modest in size */}
          <Reveal className="mx-auto max-w-2xl overflow-hidden rounded-3xl shadow-[var(--shadow-card)]">
            <div className="relative aspect-[16/9]">
              <Image
                src={MEDIA.team.group}
                alt="The Hungry Worms team"
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-cover"
              />
            </div>
          </Reveal>

          {/* Roster */}
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
            {TEAM.map(({ name, role }, i) => (
              <Reveal key={name} delay={i * 60} className="text-center">
                <div className="mx-auto mb-2 h-0.5 w-8 rounded-full bg-green-leaf" aria-hidden="true" />
                <div className="font-semibold text-soil text-sm">{name}</div>
                <div className="text-xs text-soil/55 mt-0.5 leading-snug">{role}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Uncle Bob's callout */}
      <section className="relative overflow-hidden bg-green-primary text-white py-16">
        <div className="absolute -bottom-20 -left-16 size-72 rounded-full bg-green-leaf/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
            Our sister brand: Uncle Bob&apos;s Regenerative Garden Products
          </h2>
          <p className="mt-4 text-white/75 leading-relaxed">
            The finished output of our recycling process becomes Uncle Bob&apos;s premium, 100% natural,
            NZ-made, 100% natural fertiliser. Available online and in selected retailers nationwide.
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
      <section className="relative overflow-hidden bg-soil text-white py-16 bg-grain">
        <div className="absolute inset-0 bg-mesh opacity-30" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
            Want to work with us?
          </h2>
          <p className="mt-3 text-white/70">Start with a free trial or get in touch to learn more.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-cta px-7 py-3 text-sm font-bold text-white shadow-[var(--shadow-cta)] hover:bg-cta-dark transition-all hover:gap-3"
            >
              Start a Free Trial
              <Icon name="arrow-right" className="size-4" />
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

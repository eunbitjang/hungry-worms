import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Icon from "../components/Icon";
import { MEDIA } from "@/lib/media";
import { UNCLE_BOBS } from "@/lib/links";

export const metadata: Metadata = {
  title: "Buy Composting Worms in Christchurch & Canterbury, NZ",
  description:
    "Looking to buy composting worms? Hungry Worms' live worms and regenerative garden products are sold through our sister shop, Uncle Bob's — premium NZ-made, delivered nationwide.",
  alternates: { canonical: "/worms" },
  openGraph: {
    title: "Buy Composting Worms in Christchurch & Canterbury, NZ",
    description:
      "Hungry Worms' live composting worms and garden products are sold at Uncle Bob's — premium, NZ-made, delivered nationwide.",
  },
};

/* Products carried by Uncle Bob's — the shop worm-buyers actually want. */
const PRODUCTS: { name: string; image: string }[] = [
  { name: "Premium Composting Worms", image: MEDIA.products.worms },
  { name: "Premium Worm Castings", image: MEDIA.products.vermicast },
  { name: "All-Purpose Plant Food", image: MEDIA.products.plantFood },
  { name: "Regenerative Solid Fertiliser", image: MEDIA.products.fertiliser },
];

export default function WormsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-green-deep text-white py-16 lg:py-24 bg-grain">
        <div className="absolute inset-0 bg-mesh" aria-hidden="true" />
        {MEDIA.wormsInHands && (
          <Image
            src={MEDIA.wormsInHands}
            alt="Live composting worms in healthy soil"
            fill
            sizes="100vw"
            className="object-cover opacity-20"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-green-deep via-green-deep/80 to-green-deep/40" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-leaf backdrop-blur-sm">
            <Icon name="worm" className="size-4" />
            Buy Composting Worms
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Buy composting worms in Christchurch &amp; Canterbury
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/80">
            You&apos;re in the right place. Hungry Worms runs Canterbury&apos;s commercial
            food &amp; green-waste recycling — and our live composting worms and garden
            products are sold through our sister shop, <strong className="text-white">Uncle Bob&apos;s</strong>,
            delivered nationwide.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={UNCLE_BOBS.worms}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-cta px-7 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-cta)] hover:bg-cta-dark transition-all hover:gap-3"
            >
              Shop composting worms
              <span aria-hidden="true">↗</span>
            </a>
            <a
              href={UNCLE_BOBS.shop}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Browse all garden products
            </a>
          </div>
        </div>
      </section>

      {/* Why two brands */}
      <section className="relative overflow-hidden bg-offwhite bg-dots py-16 lg:py-20">
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-extrabold text-green-deep sm:text-3xl text-center">
            Hungry Worms and Uncle Bob&apos;s — one full circle
          </h2>
          <p className="mt-4 text-center text-soil/70 leading-relaxed">
            We split the journey across two brands so each does one thing brilliantly.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="card-lift rounded-2xl bg-white border border-soil/8 shadow-[var(--shadow-card)] p-6">
              <div className="flex size-11 items-center justify-center rounded-xl bg-green-primary/10 text-green-primary">
                <Icon name="recycle" className="size-6" />
              </div>
              <h3 className="mt-4 font-display font-bold text-green-deep">Hungry Worms</h3>
              <p className="mt-2 text-sm text-soil/70 leading-relaxed">
                Collects commercial food &amp; green waste across Canterbury and recycles it
                through compost worms — the service side of the circle.
              </p>
            </div>
            <div className="card-lift rounded-2xl bg-white border border-soil/8 shadow-[var(--shadow-card)] p-6">
              <div className="flex size-11 items-center justify-center rounded-xl bg-green-primary/10 text-green-primary">
                <Icon name="worm" className="size-6" />
              </div>
              <h3 className="mt-4 font-display font-bold text-green-deep">Uncle Bob&apos;s</h3>
              <p className="mt-2 text-sm text-soil/70 leading-relaxed">
                Sells the live composting worms and 100% natural, NZ-made garden products
                made from what we recycle — the shop side of the circle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product range */}
      <section className="relative overflow-hidden bg-green-primary text-white py-16 lg:py-20">
        <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-green-leaf/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
              What you can buy at Uncle Bob&apos;s
            </h2>
            <p className="mt-3 text-white/80">
              Premium, 100% natural and NZ-made — delivered nationwide.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {PRODUCTS.map(({ name, image }) => (
              <a
                key={name}
                href={UNCLE_BOBS.worms}
                target="_blank"
                rel="noopener noreferrer"
                className="card-lift group block overflow-hidden rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm"
              >
                <div className="relative aspect-square">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold">{name}</p>
                </div>
              </a>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href={UNCLE_BOBS.worms}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-green-deep hover:bg-green-leaf hover:text-soil transition-all hover:gap-3"
            >
              Shop composting worms at Uncle Bob&apos;s
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* For businesses */}
      <section className="bg-offwhite py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-soil/70 leading-relaxed">
            Run a café, restaurant, hotel or business with food &amp; green waste? That&apos;s
            the part <strong className="text-green-deep">we</strong> handle.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/services"
              className="rounded-full border border-green-primary px-6 py-2.5 text-sm font-semibold text-green-primary hover:bg-green-primary/5 transition-colors"
            >
              See our recycling service
            </Link>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-cta px-6 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-cta)] hover:bg-cta-dark transition-all hover:gap-3"
            >
              Start a free trial
              <Icon name="arrow-right" className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

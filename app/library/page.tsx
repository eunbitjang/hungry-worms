import type { Metadata } from "next";
import Link from "next/link";
import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import { LIBRARY_ARTICLES, formatArticleDate } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Library — Regenerative Farming & Food Security in the News",
  description:
    "A curated archive of news and explainer articles on regenerative farming, natural farming, worm farming and food security — the bigger picture behind Hungry Worms.",
  openGraph: {
    title: "Library — The Bigger Picture | Hungry Worms",
    description:
      "Curated news on regenerative farming, worm farming, food security and the circular economy — why the work we do matters.",
    url: "/library",
  },
  alternates: { canonical: "/library" },
};

// Structured data: a curated collection of (external) articles.
const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Hungry Worms Library",
  description:
    "A curated archive of news and explainer articles on regenerative farming, natural farming, worm farming and food security.",
  url: "https://www.hungryworms.nz/library",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: LIBRARY_ARTICLES.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: a.url,
      name: a.title,
    })),
  },
};

export default function LibraryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-green-deep text-white py-16 lg:py-20 bg-grain">
        <div className="absolute inset-0 bg-mesh" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-leaf backdrop-blur-sm">
            The Library
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            The bigger picture
          </h1>
          <p className="mt-4 text-white/75 text-lg leading-relaxed">
            A curated archive of stories on regenerative farming, natural farming, worm farming and
            food security. These are the ideas behind our work — gathered so more people can see why
            recycling organic waste, and rebuilding soil, matters.
          </p>
          <p className="mt-3 text-sm text-white/45">
            Articles link out to their original publishers. Summaries are our own.
          </p>
        </div>
      </section>

      {/* Article grid */}
      <section className="relative overflow-hidden bg-offwhite bg-dots py-16 lg:py-20">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LIBRARY_ARTICLES.map((article, i) => (
              <Reveal key={article.url} delay={(i % 3) * 90}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-lift group flex h-full flex-col rounded-2xl bg-white border border-soil/8 p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-primary/10 px-2.5 py-1 font-semibold text-green-primary">
                      {article.region === "NZ" ? "New Zealand" : "International"}
                    </span>
                    <span className="text-soil/45">
                      {article.approxDate ? "~ " : ""}
                      {formatArticleDate(article.date)}
                    </span>
                  </div>

                  <h2 className="mt-4 font-display font-bold text-green-deep leading-snug group-hover:text-cta transition-colors">
                    {article.title}
                  </h2>

                  <p className="mt-2.5 text-sm leading-relaxed text-soil/65 flex-1">
                    {article.summary}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-soil/8 pt-4">
                    <span className="text-xs font-semibold text-soil/55">{article.source}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-primary group-hover:text-cta group-hover:gap-2 transition-all">
                      Read article
                      <span aria-hidden="true">↗</span>
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-green-primary text-white py-16">
        <div className="absolute -bottom-20 -left-16 size-72 rounded-full bg-green-leaf/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
            From reading about it to doing it
          </h2>
          <p className="mt-3 text-white/80">
            We turn Canterbury&apos;s food &amp; green waste into local soil — measurable, every pickup.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-green-deep hover:bg-green-leaf hover:text-soil transition-all hover:gap-3"
            >
              Start a one-month trial
              <Icon name="arrow-right" className="size-4" />
            </Link>
            <Link
              href="/process"
              className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              See our process
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

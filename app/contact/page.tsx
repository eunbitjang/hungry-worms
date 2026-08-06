import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "./ContactForm";
import Icon from "../components/Icon";
import { MEDIA } from "@/lib/media";

export const metadata: Metadata = {
  title: "Contact Us — Start Your Free Trial",
  description:
    "Get in touch with Hungry Worms. Start a free trial, ask about our services, or find out how we can help your business reduce its environmental footprint.",
  openGraph: {
    title: "Contact Us — Start Your Free Trial | Hungry Worms",
    description:
      "Get in touch with Hungry Worms. Start a free trial, ask about our services, or find out how we can help your business reduce its environmental footprint.",
    url: "/contact",
  },
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-green-deep text-white py-16 lg:py-20 bg-grain">
        {MEDIA.handsTogether && (
          <Image
            src={MEDIA.handsTogether}
            alt=""
            fill
            priority
            sizes="100vw"
            aria-hidden="true"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-green-deep/95 via-green-deep/80 to-green-deep/25" aria-hidden="true" />
        <div className="absolute inset-0 bg-mesh opacity-50" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-leaf backdrop-blur-sm">
              Contact Us
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
              Let&apos;s chat!
            </h1>
            <p className="mt-4 text-white/75 text-lg leading-relaxed">
              Whether you&apos;re ready to start a free trial or just want to explore options —
              we&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section className="bg-offwhite py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Form */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div className="relative overflow-hidden rounded-2xl bg-green-deep text-white p-7 bg-grain">
                <div className="absolute inset-0 bg-mesh opacity-40" aria-hidden="true" />
                <div className="relative">
                  <h3 className="font-display font-bold text-lg mb-4">Direct contact</h3>
                  <div className="space-y-3.5 text-sm text-white/80">
                    <a href="tel:02041841840" className="flex items-center gap-3 hover:text-white transition-colors">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-green-leaf">
                        <Icon name="phone" className="size-4.5" />
                      </span>
                      <span>020 4184 1840</span>
                    </a>
                    <a href="mailto:info@hungryworms.nz" className="flex items-center gap-3 hover:text-white transition-colors">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-green-leaf">
                        <Icon name="mail" className="size-4.5" />
                      </span>
                      <span>info@hungryworms.nz</span>
                    </a>
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-green-leaf">
                        <Icon name="map-pin" className="size-4.5" />
                      </span>
                      <span>Canterbury, New Zealand</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-cta/12 to-cta/5 border border-cta/20 p-7">
                <div className="flex size-12 items-center justify-center rounded-xl bg-cta text-white mb-4">
                  <Icon name="gift" className="size-6" />
                </div>
                <h3 className="font-display font-bold text-soil text-base mb-2">Free trial available</h3>
                <p className="text-sm text-soil/70 leading-relaxed">
                  Start with zero commitment. We&apos;ll set up bins, run your first collection, and
                  send you an impact report — no invoice until you decide to continue.
                </p>
                <p className="mt-3 text-xs font-semibold text-cta-dark">
                  99% of trial clients become long-term partners.
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-soil/8 p-7 shadow-[var(--shadow-card)]">
                <h3 className="font-display font-bold text-soil text-base mb-3">Uncle Bob&apos;s Shop</h3>
                <p className="text-sm text-soil/70 leading-relaxed mb-4">
                  Looking for premium NZ-made garden products? Visit our sister brand.
                </p>
                <a
                  href="https://www.unclebobs.co.nz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-green-primary hover:text-green-deep transition-colors"
                >
                  unclebobs.co.nz ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./ContactForm";

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
      <section className="bg-green-deep text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-green-leaf mb-3">Contact Us</p>
            <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
              Let&apos;s chat!
            </h1>
            <p className="mt-4 text-white/80 text-lg leading-relaxed">
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
              <div className="rounded-2xl bg-green-deep text-white p-7">
                <h3 className="font-display font-bold text-lg mb-4">Direct contact</h3>
                <div className="space-y-3 text-sm text-white/80">
                  <a href="tel:02041841840" className="flex items-center gap-3 hover:text-white transition-colors">
                    <span className="text-xl">📞</span>
                    <span>020 4184 1840</span>
                  </a>
                  <a href="mailto:info@hungryworms.nz" className="flex items-center gap-3 hover:text-white transition-colors">
                    <span className="text-xl">✉️</span>
                    <span>info@hungryworms.nz</span>
                  </a>
                  <div className="flex items-start gap-3">
                    <span className="text-xl">📍</span>
                    <span>Canterbury, New Zealand</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-cta/10 border border-cta/20 p-7">
                <div className="text-3xl mb-3">🎁</div>
                <h3 className="font-display font-bold text-soil text-base mb-2">Free trial available</h3>
                <p className="text-sm text-soil/70 leading-relaxed">
                  Start with zero commitment. We&apos;ll set up bins, run your first collection, and
                  send you an impact report — no invoice until you decide to continue.
                </p>
                <p className="mt-3 text-xs font-semibold text-cta-dark">
                  99% of trial clients become long-term partners.
                </p>
              </div>

              <div className="rounded-2xl bg-offwhite border border-soil/10 p-7">
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

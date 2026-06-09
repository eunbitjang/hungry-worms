import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Hungry Worms collects, uses, and protects your personal information, in line with the New Zealand Privacy Act 2020.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "June 2026";

export default function PrivacyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-green-deep text-white py-16 lg:py-20 bg-grain">
        <div className="absolute inset-0 bg-mesh" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-leaf backdrop-blur-sm">
            Legal
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-white/70">Last updated: {UPDATED}</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-offwhite py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose-hw space-y-8 text-soil/75 leading-relaxed">
            <p>
              Hungry Worms Ltd (&ldquo;Hungry Worms&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
              &ldquo;our&rdquo;) is committed to protecting your privacy. This policy explains how we
              collect, use, store, and disclose your personal information in accordance with the New
              Zealand Privacy Act 2020. By using our website or services, you agree to the practices
              described below.
            </p>

            <div>
              <h2 className="font-display text-xl font-extrabold text-green-deep">1. Information we collect</h2>
              <p className="mt-3">We may collect the following information:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>
                  <strong>Contact details</strong> — your name, business name, email address, and phone
                  number, when you enquire, request a free trial, or become a client.
                </li>
                <li>
                  <strong>Service data</strong> — information related to your waste collection, such as
                  pickup dates, locations, waste volumes, and bin details.
                </li>
                <li>
                  <strong>Account data</strong> — the email address you use to sign in to the client
                  portal, and your association with a client organisation.
                </li>
                <li>
                  <strong>Website usage</strong> — basic technical information (such as browser type and
                  pages visited) that may be collected automatically to help us improve the site.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-extrabold text-green-deep">2. How we use your information</h2>
              <p className="mt-3">We use your personal information to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>provide, manage, and improve our waste collection and recycling services;</li>
                <li>respond to your enquiries and arrange free trials or tailored plans;</li>
                <li>generate the impact and sustainability reports available in your client portal;</li>
                <li>communicate with you about your service, including updates and reminders;</li>
                <li>meet our legal and regulatory obligations.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-extrabold text-green-deep">3. Sharing and disclosure</h2>
              <p className="mt-3">
                We do not sell your personal information. We may share it with trusted service providers
                who help us operate our business (such as hosting, email delivery, and database
                providers), strictly for the purposes described in this policy. These providers are
                required to protect your information and may only use it to deliver services to us.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-extrabold text-green-deep">4. Data storage and security</h2>
              <p className="mt-3">
                Your information is stored securely, and access is restricted to authorised personnel.
                Client portal data is protected so that each client can only access their own
                organisation&apos;s information. While we take reasonable steps to safeguard your data,
                no method of transmission or storage is completely secure.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-extrabold text-green-deep">5. Your rights</h2>
              <p className="mt-3">
                Under the Privacy Act 2020, you have the right to request access to the personal
                information we hold about you, and to request that we correct it if it is inaccurate. To
                make a request, please contact us using the details below.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-extrabold text-green-deep">6. Cookies</h2>
              <p className="mt-3">
                Our website may use essential cookies to enable core functionality, such as keeping you
                signed in to the client portal. You can control cookies through your browser settings,
                though disabling them may affect how the site works.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-extrabold text-green-deep">7. Changes to this policy</h2>
              <p className="mt-3">
                We may update this Privacy Policy from time to time. Any changes will be posted on this
                page with an updated revision date.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-extrabold text-green-deep">8. Contact us</h2>
              <p className="mt-3">
                If you have any questions about this policy or how we handle your information, please get
                in touch:
              </p>
              <ul className="mt-3 list-none space-y-1 pl-0">
                <li>
                  Email:{" "}
                  <a href="mailto:info@hungryworms.nz" className="font-semibold text-green-primary hover:underline">
                    info@hungryworms.nz
                  </a>
                </li>
                <li>
                  Phone:{" "}
                  <a href="tel:02041841840" className="font-semibold text-green-primary hover:underline">
                    020 4184 1840
                  </a>
                </li>
                <li>Hungry Worms Ltd, Canterbury, New Zealand</li>
              </ul>
            </div>

            <p className="text-sm text-soil/50">
              This Privacy Policy is provided as general information and does not constitute legal
              advice.
            </p>
          </div>

          <div className="mt-12 border-t border-soil/10 pt-8">
            <Link href="/contact" className="text-sm font-semibold text-green-primary hover:underline">
              Have a question? Contact us →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

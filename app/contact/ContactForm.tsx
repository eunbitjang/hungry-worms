"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const SERVICES = [
  "Commercial waste collection",
  "On-site composter installation",
  "Composter machine leasing",
  "Fertiliser supply",
  "General enquiry",
];

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setStatus(res.ok ? "success" : "error");
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-white border border-green-primary/10 p-8 shadow-sm text-center space-y-4">
        <div className="text-5xl">🎉</div>
        <h2 className="font-display text-2xl font-extrabold text-green-deep">Message sent!</h2>
        <p className="text-soil/70 leading-relaxed">
          Thanks for reaching out. We&apos;ll be in touch within one business day to discuss your
          sustainability journey.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setForm({ firstName: "", lastName: "", email: "", phone: "", company: "", service: "", message: "" });
          }}
          className="mt-2 rounded-full border border-green-primary px-6 py-2.5 text-sm font-semibold text-green-primary hover:bg-green-primary hover:text-white transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-green-primary/10 p-8 shadow-sm space-y-5">
      <h2 className="font-display text-xl font-bold text-soil">Send us a message</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-xs font-semibold text-soil/70 mb-1">First name *</label>
          <input id="firstName" name="firstName" type="text" required value={form.firstName} onChange={handleChange}
            className="w-full rounded-lg border border-soil/20 bg-offwhite px-3.5 py-2.5 text-sm text-soil focus:border-green-primary focus:outline-none focus:ring-2 focus:ring-green-primary/20" />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-xs font-semibold text-soil/70 mb-1">Last name *</label>
          <input id="lastName" name="lastName" type="text" required value={form.lastName} onChange={handleChange}
            className="w-full rounded-lg border border-soil/20 bg-offwhite px-3.5 py-2.5 text-sm text-soil focus:border-green-primary focus:outline-none focus:ring-2 focus:ring-green-primary/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-soil/70 mb-1">Email *</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange}
            className="w-full rounded-lg border border-soil/20 bg-offwhite px-3.5 py-2.5 text-sm text-soil focus:border-green-primary focus:outline-none focus:ring-2 focus:ring-green-primary/20" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-soil/70 mb-1">Phone</label>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
            className="w-full rounded-lg border border-soil/20 bg-offwhite px-3.5 py-2.5 text-sm text-soil focus:border-green-primary focus:outline-none focus:ring-2 focus:ring-green-primary/20" />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="block text-xs font-semibold text-soil/70 mb-1">Business / organisation</label>
        <input id="company" name="company" type="text" value={form.company} onChange={handleChange}
          className="w-full rounded-lg border border-soil/20 bg-offwhite px-3.5 py-2.5 text-sm text-soil focus:border-green-primary focus:outline-none focus:ring-2 focus:ring-green-primary/20" />
      </div>

      <div>
        <label htmlFor="service" className="block text-xs font-semibold text-soil/70 mb-1">I&apos;m interested in…</label>
        <select id="service" name="service" value={form.service} onChange={handleChange}
          className="w-full rounded-lg border border-soil/20 bg-offwhite px-3.5 py-2.5 text-sm text-soil focus:border-green-primary focus:outline-none focus:ring-2 focus:ring-green-primary/20">
          <option value="">Select a service</option>
          {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-semibold text-soil/70 mb-1">Message *</label>
        <textarea id="message" name="message" rows={5} required value={form.message} onChange={handleChange}
          placeholder="Tell us about your business and what you're looking to achieve…"
          className="w-full rounded-lg border border-soil/20 bg-offwhite px-3.5 py-2.5 text-sm text-soil focus:border-green-primary focus:outline-none focus:ring-2 focus:ring-green-primary/20 resize-none" />
      </div>

      {status === "error" && (
        <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2.5">
          Something went wrong. Please try again or email us directly at{" "}
          <a href="mailto:info@hungryworms.nz" className="underline">info@hungryworms.nz</a>.
        </p>
      )}

      <button type="submit" disabled={status === "sending"}
        className="w-full rounded-full bg-cta py-3.5 text-sm font-bold text-white shadow-md hover:bg-cta-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
      <p className="text-xs text-soil/40 text-center">We&apos;ll respond within one business day.</p>
    </form>
  );
}

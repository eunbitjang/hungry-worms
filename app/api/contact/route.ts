import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = "info@hungryworms.nz";
const FROM_EMAIL = "onboarding@resend.dev"; // swap to e.g. "hello@hungryworms.nz" after DNS verification

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { firstName, lastName, email, phone, company, service, message } =
    body as Record<string, string>;

  if (!firstName || !lastName || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Basic email format check (belt-and-suspenders — browser already validates)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New enquiry from ${firstName} ${lastName}${company ? ` (${company})` : ""}`,
      text: [
        `Name: ${firstName} ${lastName}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        company ? `Company: ${company}` : null,
        service ? `Interested in: ${service}` : null,
        "",
        "Message:",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Resend error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

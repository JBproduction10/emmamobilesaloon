import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import twilio from "twilio";

type BookingPayload = {
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  area: string;
};

function isValidBooking(body: unknown): body is BookingPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    b.name.trim().length > 0 &&
    typeof b.phone === "string" &&
    b.phone.trim().length > 0 &&
    typeof b.service === "string" &&
    b.service.trim().length > 0 &&
    typeof b.date === "string" &&
    b.date.trim().length > 0 &&
    typeof b.time === "string" &&
    b.time.trim().length > 0 &&
    typeof b.area === "string" &&
    b.area.trim().length > 0
  );
}

function buildSummary(b: BookingPayload) {
  return [
    "New booking request — Bare & Gloss",
    "",
    `Name: ${b.name}`,
    `Phone: ${b.phone}`,
    `Treatment: ${b.service}`,
    `Preferred date: ${b.date}`,
    `Preferred time: ${b.time}`,
    `Area: ${b.area}`,
  ].join("\n");
}

async function sendEmail(summary: string, b: BookingPayload) {
  const { GMAIL_USER, GMAIL_APP_PASSWORD, NOTIFY_EMAIL } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !NOTIFY_EMAIL) {
    return { skipped: true as const };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });

  await transporter.sendMail({
    from: `"Bare & Gloss Bookings" <${GMAIL_USER}>`,
    to: NOTIFY_EMAIL,
    subject: `New booking: ${b.name} — ${b.service}`,
    text: summary,
  });

  return { skipped: false as const };
}

async function sendSms(summary: string) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SMS_FROM, NOTIFY_PHONE } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_SMS_FROM || !NOTIFY_PHONE) {
    return { skipped: true as const };
  }

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  await client.messages.create({
    body: summary,
    from: TWILIO_SMS_FROM,
    to: NOTIFY_PHONE,
  });

  return { skipped: false as const };
}

async function sendWhatsapp(summary: string) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM, NOTIFY_WHATSAPP } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM || !NOTIFY_WHATSAPP) {
    return { skipped: true as const };
  }

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  await client.messages.create({
    body: summary,
    from: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
    to: `whatsapp:${NOTIFY_WHATSAPP}`,
  });

  return { skipped: false as const };
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!isValidBooking(body)) {
    return NextResponse.json(
      { ok: false, error: "Missing or invalid booking fields" },
      { status: 400 },
    );
  }

  const booking = body;
  const summary = buildSummary(booking);

  const channels: Record<string, "sent" | "skipped" | "failed"> = {
    email: "skipped",
    sms: "skipped",
    whatsapp: "skipped",
  };
  const errors: string[] = [];

  const attempts: Array<[keyof typeof channels, () => Promise<{ skipped: boolean }>]> = [
    ["email", () => sendEmail(summary, booking)],
    ["sms", () => sendSms(summary)],
    ["whatsapp", () => sendWhatsapp(summary)],
  ];

  for (const [channel, run] of attempts) {
    try {
      const result = await run();
      channels[channel] = result.skipped ? "skipped" : "sent";
    } catch (err) {
      channels[channel] = "failed";
      const message = err instanceof Error ? err.message : "unknown error";
      errors.push(`${channel}: ${message}`);
      console.error(`[book] ${channel} notification failed:`, err);
    }
  }

  const sentAny = Object.values(channels).some((status) => status === "sent");
  const configuredAny = Object.values(channels).some((status) => status !== "skipped");

  if (!configuredAny) {
    return NextResponse.json(
      {
        ok: false,
        error: "No notification channel is configured. Set the required environment variables in Vercel.",
        channels,
      },
      { status: 500 },
    );
  }

  if (!sentAny) {
    return NextResponse.json(
      { ok: false, error: "All configured notification channels failed", channels, errors },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, channels, errors: errors.length ? errors : undefined });
}

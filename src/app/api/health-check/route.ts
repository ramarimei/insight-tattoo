import { NextRequest, NextResponse } from "next/server";
import { resolveTxt } from "node:dns/promises";

// Weekly automated health check (triggered by Vercel Cron — see vercel.json).
// Verifies the three things that broke in the July 2026 incident (see the
// INSIGHT-TATTOO board): the site is live and not reverted to the old
// WordPress site, the DKIM email-verification record is present, and Resend
// can actually send from the domain. On any failure it emails Renee an alert.

const SITE_URL = "https://insighttattoo.co.nz";
const ALERT_TO = "info@insighttattoo.co.nz"; // Renee
const FROM_PRIMARY = "Insight Tattoo Monitor <noreply@insighttattoo.co.nz>";
// Fallback sender that works even when the domain's own email is broken —
// so an alert about "email is down" can still be delivered.
const FROM_FALLBACK = "Insight Tattoo Monitor <onboarding@resend.dev>";
const DKIM_HOST = "resend._domainkey.insighttattoo.co.nz";

async function sendEmail(from: string, subject: string, text: string) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: ALERT_TO, subject, text }),
  });
}

export async function GET(request: NextRequest) {
  // Only Vercel Cron (or a caller who knows the secret) may run this.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const failures: string[] = [];

  // 1. Site is up and hasn't reverted to the old WordPress site.
  try {
    const res = await fetch(SITE_URL, {
      headers: { "user-agent": "insight-health-check" },
      cache: "no-store",
    });
    const html = await res.text();
    if (!res.ok) {
      failures.push(`The website returned an error (HTTP ${res.status}) and may be down.`);
    } else if (/wp-content|wp-includes/i.test(html) || !/_next/i.test(html)) {
      failures.push(
        "The website appears to have reverted to the old version (the current site's code wasn't detected). This usually means the domain's DNS was reset — do NOT click 'Restore DNS Records' in the domain panel."
      );
    }
  } catch (e) {
    failures.push(`The website could not be reached at all (${(e as Error).message}).`);
  }

  // 2. DKIM email-verification record is present in DNS.
  try {
    const records = await resolveTxt(DKIM_HOST);
    const joined = records.map((r) => r.join("")).join("");
    if (!joined.includes("p=")) {
      failures.push(
        "The email verification record (DKIM) is missing from the domain's DNS, so enquiry notification emails will stop being delivered."
      );
    }
  } catch {
    failures.push(
      "The email verification record (DKIM) is missing from the domain's DNS, so enquiry notification emails will stop being delivered."
    );
  }

  // 3. Resend can actually send from the domain.
  let resendSendOk = false;
  try {
    const res = await sendEmailTest();
    resendSendOk = res.ok;
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      failures.push(
        `Email sending is failing — the email service rejected a test send (${body.message || res.status}). Enquiry notifications won't reach the inbox.`
      );
    }
  } catch (e) {
    failures.push(`Email sending is failing (${(e as Error).message}). Enquiry notifications won't reach the inbox.`);
  }

  const checkedAt = new Date().toISOString();

  if (failures.length === 0) {
    return NextResponse.json({ ok: true, checkedAt });
  }

  // Something is wrong — alert Renee. Prefer the domain sender, but fall back
  // to Resend's shared sender if the domain's own email is the broken thing.
  const from = resendSendOk ? FROM_PRIMARY : FROM_FALLBACK;
  const list = failures.map((f) => `• ${f}`).join("\n");
  const text =
    `The automated weekly check found a problem with the Insight Tattoo website:\n\n${list}\n\n` +
    `What this means: part of the website or its enquiry emails may not be working. ` +
    `Customer enquiries are still being saved safely, but you may not be getting email alerts for them.\n\n` +
    `Please forward this to Ramari so it can be fixed. You can see all enquiries anytime at ${SITE_URL}/admin/enquiries.\n\n` +
    `— Automated health check`;

  try {
    await sendEmail(from, "⚠️ Insight Tattoo website needs attention", text);
  } catch (e) {
    console.error("Health check: failed to send alert email", e);
  }

  return NextResponse.json({ ok: false, failures, checkedAt });
}

// Lightweight test send to Resend's sink address (delivers nowhere real).
function sendEmailTest() {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_PRIMARY,
      to: "delivered@resend.dev",
      subject: "health check",
      text: "health check",
    }),
  });
}

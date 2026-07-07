import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit } from "@/lib/rate-limit";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  // Rate limit: 5 submissions per IP per hour
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed, retryAfterMs } = rateLimit(`enquiry:${ip}`, 5, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
    );
  }

  const formData = await request.formData();

  // Honeypot check — if this hidden field has a value, it's a bot
  const honeypot = formData.get("website") as string;
  if (honeypot) {
    // Silently accept but don't process — bots think it worked
    return NextResponse.json({ success: true, enquiryId: "ok", imagesUploaded: 0 });
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const artistPreference = formData.get("artist_preference") as string;
  const message = formData.get("message") as string;
  const files = formData.getAll("images") as File[];

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required" },
      { status: 400 }
    );
  }

  // Create enquiry
  const { data: enquiry, error: enquiryError } = await supabase
    .from("enquiries")
    .insert({
      name,
      email,
      artist_preference: artistPreference || null,
      message,
    })
    .select()
    .single();

  if (enquiryError) {
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 }
    );
  }

  // Upload images if any. Read each file's bytes once and reuse them for both
  // the storage upload and the email attachment, so the notification email
  // carries the actual photos (Renee wants them in the email, not just links).
  const uploadedImages: { url: string; name: string }[] = [];
  const attachments: { filename: string; content: Buffer }[] = [];
  const MAX_ATTACH_BYTES = 20 * 1024 * 1024; // stay well under Resend's 40MB/email limit
  let attachBytes = 0;

  for (const file of files) {
    if (file.size === 0) continue;

    const buffer = Buffer.from(await file.arrayBuffer());

    const fileExt = file.name.split(".").pop();
    const fileName = `${enquiry.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("enquiry-uploads")
      .upload(fileName, buffer, { contentType: file.type || undefined });

    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from("enquiry-uploads")
        .getPublicUrl(fileName);

      uploadedImages.push({ url: urlData.publicUrl, name: file.name });

      // Attach the original file to the email, up to a total size budget.
      if (attachBytes + buffer.length <= MAX_ATTACH_BYTES) {
        attachments.push({ filename: file.name, content: buffer });
        attachBytes += buffer.length;
      }

      await supabase.from("enquiry_images").insert({
        enquiry_id: enquiry.id,
        image_url: urlData.publicUrl,
        file_name: file.name,
      });
    }
  }

  // Send email notification
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://insight-tattoo.vercel.app";

    // Escape user-provided values before embedding them in the HTML email.
    const esc = (s: string) =>
      (s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    const imagesHtml = uploadedImages.length
      ? `<p style="margin:16px 0 8px"><strong>Inspiration images:</strong></p>` +
        uploadedImages
          .map(
            (img) =>
              `<div style="margin:0 0 12px"><img src="${esc(img.url)}" alt="${esc(
                img.name
              )}" style="max-width:420px;width:100%;border-radius:8px;display:block" /><a href="${esc(
                img.url
              )}" style="font-size:12px;color:#666">${esc(img.name)}</a></div>`
          )
          .join("")
      : "";

    const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#222;line-height:1.5">
  <h2 style="margin:0 0 12px">New tattoo enquiry from ${esc(name)}</h2>
  <p style="margin:0 0 4px"><strong>Name:</strong> ${esc(name)}</p>
  <p style="margin:0 0 4px"><strong>Email:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a></p>
  <p style="margin:0 0 12px"><strong>Artist preference:</strong> ${esc(artistPreference) || "No preference"}</p>
  <p style="margin:0 0 4px"><strong>Message:</strong></p>
  <p style="margin:0 0 12px;white-space:pre-wrap">${esc(message)}</p>
  ${imagesHtml}
  <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
  <p style="margin:0"><a href="${esc(siteUrl)}/admin/enquiries">View all enquiries</a></p>
</div>`;

    // Plain-text fallback for clients that don't render HTML.
    const imageLinks = uploadedImages.length
      ? `\n\nInspiration Images:\n${uploadedImages.map((img, i) => `${i + 1}. ${img.url}`).join("\n")}`
      : "";
    const text = `New tattoo enquiry received:\n\nName: ${name}\nEmail: ${email}\nArtist Preference: ${artistPreference || "No preference"}\n\nMessage:\n${message}${imageLinks}\n\n---\nView all enquiries: ${siteUrl}/admin/enquiries`;

    await resend.emails.send({
      from: "Insight Tattoo <noreply@insighttattoo.co.nz>",
      to: "info@insighttattoo.co.nz",
      replyTo: email,
      subject: `New Enquiry from ${name}`,
      html,
      text,
      attachments: attachments.length ? attachments : undefined,
    });
  } catch (err) {
    // Don't fail the enquiry if email fails, but log the real error so a
    // broken notification pipeline is visible instead of silently swallowed.
    console.error("Failed to send enquiry email notification:", err);
  }

  return NextResponse.json({
    success: true,
    enquiryId: enquiry.id,
    imagesUploaded: uploadedImages.length,
  });
}

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const formData = await request.formData();

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

  // Upload images if any
  const uploadedImages: string[] = [];
  for (const file of files) {
    if (file.size === 0) continue;

    const fileExt = file.name.split(".").pop();
    const fileName = `${enquiry.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("enquiry-uploads")
      .upload(fileName, file);

    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from("enquiry-uploads")
        .getPublicUrl(fileName);

      uploadedImages.push(urlData.publicUrl);

      await supabase.from("enquiry_images").insert({
        enquiry_id: enquiry.id,
        image_url: urlData.publicUrl,
        file_name: file.name,
      });
    }
  }

  // Send email notification
  try {
    const imageLinks = uploadedImages.length > 0
      ? `\n\nInspiration Images:\n${uploadedImages.map((url, i) => `${i + 1}. ${url}`).join("\n")}`
      : "";

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Insight Tattoo <onboarding@resend.dev>",
      to: "ramari.heperi@gmail.com",
      subject: `New Enquiry from ${name}`,
      text: `New tattoo enquiry received:\n\nName: ${name}\nEmail: ${email}\nArtist Preference: ${artistPreference || "No preference"}\n\nMessage:\n${message}${imageLinks}\n\n---\nView all enquiries: ${process.env.NEXT_PUBLIC_SITE_URL || "https://insight-tattoo.vercel.app"}/admin/enquiries`,
    });
  } catch {
    // Don't fail the enquiry if email fails
    console.error("Failed to send email notification");
  }

  return NextResponse.json({
    success: true,
    enquiryId: enquiry.id,
    imagesUploaded: uploadedImages.length,
  });
}

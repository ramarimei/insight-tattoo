import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

  return NextResponse.json({
    success: true,
    enquiryId: enquiry.id,
    imagesUploaded: uploadedImages.length,
  });
}

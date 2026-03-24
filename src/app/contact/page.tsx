"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

async function compressImage(file: File, maxWidth = 1600, quality = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Compression failed"));
          const compressed = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
            type: "image/jpeg",
          });
          resolve(compressed);
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

interface ContactInfo {
  phone: string;
  email: string;
  facebook: string;
  instagram: string;
}

interface ArtistInfo {
  name: string;
  slug: string;
  email: string;
}

export default function ContactPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: "09 971 9067",
    email: "info@insighttattoo.co.nz",
    facebook: "https://facebook.com/insighttattoo.co.nz/",
    instagram: "https://instagram.com/insight_tattoo_nz",
  });
  const [artists, setArtists] = useState<ArtistInfo[]>([]);

  useEffect(() => {
    async function load() {
      const [contentRes, artistsRes] = await Promise.all([
        supabase.from("site_content").select("key, value").in("key", [
          "contact_phone", "contact_email", "contact_facebook", "contact_instagram",
        ]),
        supabase.from("artists").select("name, slug, email").order("sort_order"),
      ]);
      if (contentRes.data) {
        const map: Record<string, string> = {};
        for (const row of contentRes.data) map[row.key] = row.value;
        setContactInfo({
          phone: map.contact_phone || "09 971 9067",
          email: map.contact_email || "info@insighttattoo.co.nz",
          facebook: map.contact_facebook || "https://facebook.com/insighttattoo.co.nz/",
          instagram: map.contact_instagram || "https://instagram.com/insight_tattoo_nz",
        });
      }
      if (artistsRes.data) setArtists(artistsRes.data);
    }
    load();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const toAdd = selectedFiles.slice(0, 5 - files.length);

    // Compress each image before storing
    const compressed: File[] = [];
    for (const file of toAdd) {
      try {
        compressed.push(await compressImage(file));
      } catch {
        compressed.push(file); // fallback to original if compression fails
      }
    }

    const newFiles = [...files, ...compressed].slice(0, 5);
    setFiles(newFiles);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData();
    formData.append("name", (form.elements.namedItem("name") as HTMLInputElement).value);
    formData.append("email", (form.elements.namedItem("email") as HTMLInputElement).value);
    formData.append("artist_preference", (form.elements.namedItem("artist_preference") as HTMLSelectElement).value);
    formData.append("message", (form.elements.namedItem("message") as HTMLTextAreaElement).value);

    for (const file of files) {
      formData.append("images", file);
    }

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setSubmitted(true);
      setFiles([]);
      setPreviews([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="py-20 px-6 text-center">
        <p className="text-sage text-sm tracking-[0.3em] uppercase mb-4">
          Get In Touch
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Contact
        </h1>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Reach Out</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-sage text-sm tracking-wider uppercase mb-2">
                  Phone
                </h3>
                <p className="text-muted">
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {contactInfo.phone}
                  </a>
                </p>
                <p className="text-muted text-sm mt-1">
                  Please leave a message if we don&apos;t answer — we&apos;re
                  often in the middle of tattooing.
                </p>
              </div>

              <div>
                <h3 className="text-sage text-sm tracking-wider uppercase mb-2">
                  Email
                </h3>
                <p className="text-muted">
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                </p>
                <p className="text-muted text-sm mt-1">
                  We do get busy answering emails — if you have a delayed
                  response please get back in touch, we may have missed your
                  message.
                </p>
              </div>

              <div>
                <h3 className="text-sage text-sm tracking-wider uppercase mb-2">
                  Artist Direct
                </h3>
                <div className="space-y-2 text-muted text-sm">
                  {artists.map((artist) => (
                    <p key={artist.slug}>
                      <span className="text-foreground">{artist.name}:</span>{" "}
                      {artist.email}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sage text-sm tracking-wider uppercase mb-2">
                  Social
                </h3>
                <div className="flex gap-6">
                  <a
                    href={contactInfo.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-sage transition-colors"
                  >
                    Facebook
                  </a>
                  <a
                    href={contactInfo.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-sage transition-colors"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Send a Message</h2>

            {submitted ? (
              <div className="bg-card-bg border border-sage/30 p-8 text-center">
                <h3 className="text-xl font-bold text-sage mb-3">
                  Message Sent!
                </h3>
                <p className="text-muted text-sm leading-relaxed mb-6">
                  Thanks for getting in touch. We&apos;ll get back to you as
                  soon as we can.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sage text-sm tracking-wider uppercase hover:text-sage-dark transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm tracking-wider uppercase text-muted mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-card-bg border border-border px-4 py-3 text-foreground focus:outline-none focus:border-sage transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm tracking-wider uppercase text-muted mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full bg-card-bg border border-border px-4 py-3 text-foreground focus:outline-none focus:border-sage transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm tracking-wider uppercase text-muted mb-2">
                    Artist Preference
                  </label>
                  <select
                    name="artist_preference"
                    className="w-full bg-card-bg border border-border px-4 py-3 text-muted focus:outline-none focus:border-sage transition-colors"
                  >
                    <option value="">No preference</option>
                    {artists.map((artist) => (
                      <option key={artist.slug} value={artist.slug}>
                        {artist.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm tracking-wider uppercase text-muted mb-2">
                    Tell us about your tattoo idea
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="w-full bg-card-bg border border-border px-4 py-3 text-foreground focus:outline-none focus:border-sage transition-colors resize-none"
                    placeholder="Describe your idea, placement, size..."
                  />
                </div>

                {/* Inspiration Image Upload */}
                <div>
                  <label className="block text-sm tracking-wider uppercase text-muted mb-2">
                    Upload Inspiration Images
                  </label>
                  <p className="text-muted text-xs mb-3">
                    Share reference photos or ideas for your tattoo (up to 5
                    images)
                  </p>
                  <label className="flex flex-col items-center justify-center w-full h-32 bg-card-bg border-2 border-dashed border-border hover:border-sage cursor-pointer transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-2 text-muted"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm text-muted">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted mt-1">
                        PNG, JPG or WEBP (max 10MB each)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                    />
                  </label>

                  {previews.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-3">
                      {previews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="relative aspect-square overflow-hidden">
                            <Image
                              src={preview}
                              alt={`Inspiration ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-8 py-3 bg-sage text-background text-sm tracking-wider uppercase font-medium hover:bg-sage-dark transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

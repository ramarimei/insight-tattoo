"use client";

import { useState } from "react";
import Image from "next/image";

export default function ContactPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles = [...files, ...selectedFiles].slice(0, 5);
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
                    href="tel:099719067"
                    className="hover:text-foreground transition-colors"
                  >
                    09 971 9067
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
                    href="mailto:info@insighttattoo.co.nz"
                    className="hover:text-foreground transition-colors"
                  >
                    info@insighttattoo.co.nz
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
                  <p>
                    <span className="text-foreground">Renee:</span>{" "}
                    info@insighttattoo.co.nz
                  </p>
                  <p>
                    <span className="text-foreground">Ash:</span>{" "}
                    ashink.tattoos@icloud.com
                  </p>
                  <p>
                    <span className="text-foreground">Fae:</span>{" "}
                    fwolfepine@gmail.com
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sage text-sm tracking-wider uppercase mb-2">
                  Social
                </h3>
                <div className="flex gap-6">
                  <a
                    href="https://facebook.com/insighttattoo.co.nz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-sage transition-colors"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://instagram.com/insight_tattoo_nz"
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
            <form className="space-y-6">
              <div>
                <label className="block text-sm tracking-wider uppercase text-muted mb-2">
                  Name
                </label>
                <input
                  type="text"
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
                  className="w-full bg-card-bg border border-border px-4 py-3 text-foreground focus:outline-none focus:border-sage transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm tracking-wider uppercase text-muted mb-2">
                  Artist Preference
                </label>
                <select className="w-full bg-card-bg border border-border px-4 py-3 text-muted focus:outline-none focus:border-sage transition-colors">
                  <option value="">No preference</option>
                  <option value="renee">Renee</option>
                  <option value="ash">Ash</option>
                  <option value="fae">Fae</option>
                </select>
              </div>
              <div>
                <label className="block text-sm tracking-wider uppercase text-muted mb-2">
                  Tell us about your tattoo idea
                </label>
                <textarea
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
                  Share reference photos or ideas for your tattoo (up to 5 images)
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

                {/* Image Previews */}
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

              <button
                type="submit"
                className="w-full px-8 py-3 bg-sage text-background text-sm tracking-wider uppercase font-medium hover:bg-sage-dark transition-colors duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

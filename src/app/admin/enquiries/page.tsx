"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface EnquiryImage {
  id: string;
  image_url: string;
  file_name: string;
}

interface Enquiry {
  id: string;
  name: string;
  email: string;
  artist_preference: string | null;
  message: string;
  status: string;
  created_at: string;
  enquiry_images: EnquiryImage[];
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    const { data } = await supabase
      .from("enquiries")
      .select("*, enquiry_images(*)")
      .order("created_at", { ascending: false });
    if (data) setEnquiries(data);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("enquiries").update({ status }).eq("id", id);
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const filtered =
    filter === "all"
      ? enquiries
      : enquiries.filter((e) => e.status === filter);

  const statusColors: Record<string, string> = {
    new: "text-sage",
    read: "text-blue-400",
    replied: "text-muted",
    archived: "text-muted/50",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Enquiries</h1>
        <div className="flex gap-2">
          {["all", "new", "read", "replied", "archived"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
                filter === s
                  ? "bg-sage text-background"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
          {filtered.length === 0 && (
            <p className="text-muted text-sm">No enquiries</p>
          )}
          {filtered.map((enquiry) => (
            <button
              key={enquiry.id}
              onClick={() => {
                setSelected(enquiry);
                if (enquiry.status === "new") updateStatus(enquiry.id, "read");
              }}
              className={`w-full text-left p-4 border transition-colors ${
                selected?.id === enquiry.id
                  ? "border-sage bg-sage/10"
                  : "border-border bg-card-bg hover:border-sage/50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{enquiry.name}</span>
                <span
                  className={`text-xs uppercase tracking-wider ${statusColors[enquiry.status]}`}
                >
                  {enquiry.status}
                </span>
              </div>
              <p className="text-muted text-xs truncate">{enquiry.message}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-muted text-xs">
                  {enquiry.artist_preference || "No preference"}
                </span>
                <span className="text-muted text-xs">
                  {new Date(enquiry.created_at).toLocaleDateString()}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-card-bg border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">{selected.name}</h2>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-sage text-sm hover:text-sage-dark transition-colors"
                  >
                    {selected.email}
                  </a>
                </div>
                <div className="flex gap-2">
                  {["new", "read", "replied", "archived"].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
                        selected.status === s
                          ? "bg-sage text-background"
                          : "text-muted hover:text-foreground border border-border"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <span className="text-muted text-xs uppercase tracking-wider">
                  Artist Preference
                </span>
                <p className="text-sm mt-1">
                  {selected.artist_preference || "No preference"}
                </p>
              </div>

              <div className="mb-6">
                <span className="text-muted text-xs uppercase tracking-wider">
                  Message
                </span>
                <p className="text-sm mt-1 leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>

              <div className="mb-4">
                <span className="text-muted text-xs uppercase tracking-wider">
                  Submitted
                </span>
                <p className="text-sm mt-1">
                  {new Date(selected.created_at).toLocaleString()}
                </p>
              </div>

              {/* Inspo Images */}
              {selected.enquiry_images.length > 0 && (
                <div>
                  <span className="text-muted text-xs uppercase tracking-wider">
                    Inspiration Images
                  </span>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {selected.enquiry_images.map((img) => (
                      <a
                        key={img.id}
                        href={img.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative aspect-square overflow-hidden group"
                      >
                        <Image
                          src={img.image_url}
                          alt={img.file_name || "Inspiration"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick reply */}
              <div className="mt-6 pt-6 border-t border-border">
                <a
                  href={`mailto:${selected.email}?subject=Re: Your Tattoo Enquiry at Insight Tattoo&body=Hi ${selected.name},%0D%0A%0D%0AThanks for getting in touch!%0D%0A%0D%0A`}
                  className="px-5 py-2 bg-sage text-background text-sm tracking-wider uppercase font-medium hover:bg-sage-dark transition-colors inline-block"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-card-bg border border-border p-12 text-center">
              <p className="text-muted">Select an enquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

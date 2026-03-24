"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface Artist {
  id: string;
  name: string;
  slug: string;
  bio: string;
  email: string;
  avatar_url: string | null;
  availability: string;
  specialties: string[];
}

async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
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
        (blob) => (blob ? resolve(blob) : reject(new Error("Compression failed"))),
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

export default function ArtistsAdminPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [editing, setEditing] = useState<Artist | null>(null);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    email: "",
    availability: "",
    specialties: "",
  });
  const [uploadingAvatar, setUploadingAvatar] = useState<string | null>(null);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    const { data } = await supabase
      .from("artists")
      .select("*")
      .order("sort_order");
    if (data) setArtists(data);
  };

  const handleEdit = (artist: Artist) => {
    setEditing(artist);
    setForm({
      name: artist.name,
      bio: artist.bio || "",
      email: artist.email || "",
      availability: artist.availability || "",
      specialties: (artist.specialties || []).join(", "),
    });
  };

  const handleSave = async () => {
    if (!editing) return;
    await supabase
      .from("artists")
      .update({
        name: form.name,
        bio: form.bio,
        email: form.email,
        availability: form.availability,
        specialties: form.specialties.split(",").map((s) => s.trim()).filter(Boolean),
      })
      .eq("id", editing.id);
    setEditing(null);
    fetchArtists();
  };

  const handleAvatarUpload = async (artist: Artist, file: File) => {
    setUploadingAvatar(artist.id);

    try {
      // Compress the image
      let uploadData: Blob | File = file;
      try {
        uploadData = await compressImage(file);
      } catch {
        // Use original if compression fails
      }

      const fileName = `avatars/${artist.slug}-${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("site-assets")
        .upload(fileName, uploadData, { contentType: "image/jpeg" });

      if (uploadError) {
        alert("Upload failed: " + uploadError.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("site-assets")
        .getPublicUrl(fileName);

      await supabase
        .from("artists")
        .update({ avatar_url: urlData.publicUrl })
        .eq("id", artist.id);

      fetchArtists();
    } finally {
      setUploadingAvatar(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Artists</h1>

      {editing && (
        <div className="bg-card-bg border border-border p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Edit {editing.name}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-background border border-border px-4 py-2 text-foreground focus:outline-none focus:border-sage"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-background border border-border px-4 py-2 text-foreground focus:outline-none focus:border-sage"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1">Availability</label>
              <input
                type="text"
                value={form.availability}
                onChange={(e) => setForm({ ...form, availability: e.target.value })}
                className="w-full bg-background border border-border px-4 py-2 text-foreground focus:outline-none focus:border-sage"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1">Specialties (comma separated)</label>
              <input
                type="text"
                value={form.specialties}
                onChange={(e) => setForm({ ...form, specialties: e.target.value })}
                className="w-full bg-background border border-border px-4 py-2 text-foreground focus:outline-none focus:border-sage"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={4}
                className="w-full bg-background border border-border px-4 py-2 text-foreground focus:outline-none focus:border-sage resize-none"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-sage text-background text-sm tracking-wider uppercase font-medium hover:bg-sage-dark transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(null)}
                className="text-muted text-sm hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {artists.map((artist) => (
          <div key={artist.id} className="bg-card-bg border border-border p-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="shrink-0">
                <div className="relative w-24 h-32 overflow-hidden bg-black/20 mb-2">
                  {artist.avatar_url ? (
                    <Image
                      src={artist.avatar_url}
                      alt={artist.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted text-xs">
                      No photo
                    </div>
                  )}
                </div>
                <label className="block text-center px-2 py-1 text-xs text-sage hover:text-sage-dark cursor-pointer transition-colors">
                  {uploadingAvatar === artist.id ? "Uploading..." : "Change Photo"}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    disabled={uploadingAvatar === artist.id}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAvatarUpload(artist, file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{artist.name}</h3>
                    <p className="text-sage text-sm mb-2">{artist.email}</p>
                    <p className="text-muted text-sm mb-2">{artist.availability}</p>
                    <p className="text-muted text-sm leading-relaxed">{artist.bio}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {(artist.specialties || []).map((s) => (
                        <span
                          key={s}
                          className="text-xs bg-sage/20 text-sage px-2 py-1"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(artist)}
                    className="text-sage text-sm hover:text-sage-dark shrink-0 ml-4"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

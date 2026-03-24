"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface Artist {
  id: string;
  name: string;
}

interface GalleryImage {
  id: string;
  artist_id: string;
  image_url: string;
  title: string | null;
  created_at: string;
}

async function compressImage(file: File, maxWidth = 1600, quality = 0.8): Promise<Blob> {
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

export default function GalleryAdminPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string>("all");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  useEffect(() => {
    fetchArtists();
    fetchImages();
  }, []);

  const fetchArtists = async () => {
    const { data } = await supabase.from("artists").select("id, name").order("sort_order");
    if (data) setArtists(data);
  };

  const fetchImages = async () => {
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setImages(data);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || selectedArtist === "all") return;
    setUploading(true);

    const files = Array.from(e.target.files);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`Compressing ${i + 1}/${files.length}...`);

      // Compress image client-side before upload
      let uploadData: Blob | File = file;
      try {
        uploadData = await compressImage(file);
      } catch {
        // If compression fails, upload original
      }

      setUploadProgress(`Uploading ${i + 1}/${files.length}...`);
      const fileName = `${selectedArtist}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, uploadData, { contentType: "image/jpeg" });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("gallery")
          .getPublicUrl(fileName);

        await supabase.from("gallery_images").insert({
          artist_id: selectedArtist,
          image_url: urlData.publicUrl,
          title: file.name.replace(/\.[^/.]+$/, ""),
        });
      }
    }

    setUploading(false);
    setUploadProgress("");
    fetchImages();
    e.target.value = "";
  };

  const handleDelete = async (image: GalleryImage) => {
    if (!confirm("Delete this image?")) return;
    await supabase.from("gallery_images").delete().eq("id", image.id);
    fetchImages();
  };

  const filtered =
    selectedArtist === "all"
      ? images
      : images.filter((img) => img.artist_id === selectedArtist);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Recent Pieces</h1>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedArtist("all")}
            className={`px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
              selectedArtist === "all" ? "bg-sage text-background" : "text-muted hover:text-foreground"
            }`}
          >
            All
          </button>
          {artists.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedArtist(a.id)}
              className={`px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
                selectedArtist === a.id ? "bg-sage text-background" : "text-muted hover:text-foreground"
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>

        {selectedArtist !== "all" && (
          <label className="px-5 py-2 bg-sage text-background text-sm tracking-wider uppercase font-medium hover:bg-sage-dark transition-colors cursor-pointer">
            {uploading ? uploadProgress || "Uploading..." : "Upload Images"}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {selectedArtist === "all" && (
        <p className="text-muted text-sm mb-6">Select an artist to upload images</p>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filtered.map((img) => (
          <div key={img.id} className="relative group">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={img.image_url}
                alt={img.title || "Gallery image"}
                fill
                className="object-cover"
              />
            </div>
            <button
              onClick={() => handleDelete(img)}
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              x
            </button>
            <p className="text-muted text-xs mt-1 truncate">
              {artists.find((a) => a.id === img.artist_id)?.name}
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted text-sm col-span-full">No images yet</p>
        )}
      </div>
    </div>
  );
}

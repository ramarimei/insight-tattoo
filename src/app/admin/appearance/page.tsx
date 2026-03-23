"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface SiteAsset {
  id: string;
  key: string;
  image_url: string;
  label: string;
  updated_at: string;
}

async function compressImage(
  file: File,
  maxWidth: number,
  quality: number,
  format: "jpeg" | "png"
): Promise<Blob> {
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
        format === "png" ? "image/png" : "image/jpeg",
        quality
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function AppearancePage() {
  const [assets, setAssets] = useState<SiteAsset[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Record<string, { url: string; originalSize: number; compressedSize: number }>>({});

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    const { data } = await supabase
      .from("site_assets")
      .select("*")
      .order("label");
    if (data) setAssets(data);
  };

  const handleFileSelect = async (asset: SiteAsset, file: File) => {
    const isLogo = asset.key.includes("logo");
    const maxWidth = isLogo ? 1200 : 1920;
    const format = isLogo ? "png" : "jpeg";
    const quality = 0.8;

    try {
      const compressed = await compressImage(file, maxWidth, quality, format);
      const previewUrl = URL.createObjectURL(compressed);
      setPreviews((prev) => ({
        ...prev,
        [asset.key]: {
          url: previewUrl,
          originalSize: file.size,
          compressedSize: compressed.size,
        },
      }));
    } catch {
      alert("Could not process this image. Try a different file.");
    }
  };

  const handleSave = async (asset: SiteAsset) => {
    const preview = previews[asset.key];
    if (!preview) return;

    setUploading(asset.key);

    try {
      // Fetch the compressed blob from the preview URL
      const resp = await fetch(preview.url);
      const blob = await resp.blob();

      const isLogo = asset.key.includes("logo");
      const ext = isLogo ? "png" : "jpg";
      const fileName = `${asset.key}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("site-assets")
        .upload(fileName, blob, {
          contentType: isLogo ? "image/png" : "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        alert("Upload failed: " + uploadError.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("site-assets")
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("site_assets")
        .update({
          image_url: urlData.publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("key", asset.key);

      if (updateError) {
        alert("Failed to update: " + updateError.message);
        return;
      }

      // Clean up preview
      URL.revokeObjectURL(preview.url);
      setPreviews((prev) => {
        const next = { ...prev };
        delete next[asset.key];
        return next;
      });
      fetchAssets();
    } finally {
      setUploading(null);
    }
  };

  const handleCancel = (key: string) => {
    const preview = previews[key];
    if (preview) URL.revokeObjectURL(preview.url);
    setPreviews((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Appearance</h1>
      <p className="text-muted text-sm mb-8">
        Update hero images, logos, and backgrounds. Images are automatically
        compressed and converted — just pick any photo from your phone or
        computer.
      </p>

      <div className="space-y-8">
        {assets.map((asset) => {
          const preview = previews[asset.key];
          const isLogo = asset.key.includes("logo");
          const isUploading = uploading === asset.key;

          return (
            <div
              key={asset.id}
              className="bg-card-bg border border-border p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold">{asset.label}</h2>
                  <p className="text-muted text-xs mt-1">
                    {isLogo
                      ? "PNG with transparency · Max 1200px wide"
                      : "Auto-converted to JPEG · Max 1920px wide · 80% quality"}
                  </p>
                </div>
                {!preview && (
                  <label className="px-4 py-2 bg-sage text-background text-xs tracking-wider uppercase font-medium hover:bg-sage-dark transition-colors cursor-pointer">
                    Choose Image
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(asset, file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                )}
              </div>

              {preview ? (
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Current */}
                    <div>
                      <p className="text-muted text-xs uppercase tracking-wider mb-2">
                        Current
                      </p>
                      <div
                        className={`relative overflow-hidden bg-black/20 ${
                          isLogo ? "aspect-[4/1]" : "aspect-video"
                        }`}
                      >
                        <Image
                          src={asset.image_url}
                          alt={`Current ${asset.label}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    {/* New */}
                    <div>
                      <p className="text-sage text-xs uppercase tracking-wider mb-2">
                        New Preview
                      </p>
                      <div
                        className={`relative overflow-hidden bg-black/20 border border-sage/30 ${
                          isLogo ? "aspect-[4/1]" : "aspect-video"
                        }`}
                      >
                        <Image
                          src={preview.url}
                          alt={`New ${asset.label}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-muted text-xs">
                      {formatSize(preview.originalSize)} →{" "}
                      <span className="text-sage">
                        {formatSize(preview.compressedSize)}
                      </span>
                      {" · "}
                      {Math.round(
                        (1 - preview.compressedSize / preview.originalSize) * 100
                      )}
                      % smaller
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleCancel(asset.key)}
                        disabled={isUploading}
                        className="px-4 py-2 text-muted text-xs tracking-wider uppercase hover:text-foreground transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSave(asset)}
                        disabled={isUploading}
                        className="px-4 py-2 bg-sage text-background text-xs tracking-wider uppercase font-medium hover:bg-sage-dark transition-colors disabled:opacity-50"
                      >
                        {isUploading ? "Saving..." : "Save Change"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`relative overflow-hidden bg-black/20 ${
                    isLogo ? "aspect-[4/1]" : "aspect-video"
                  }`}
                >
                  <Image
                    src={asset.image_url}
                    alt={asset.label}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          );
        })}

        {assets.length === 0 && (
          <p className="text-muted text-sm">No site assets found. Check the database setup.</p>
        )}
      </div>
    </div>
  );
}

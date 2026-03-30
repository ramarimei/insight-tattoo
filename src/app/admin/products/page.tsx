"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  active: boolean;
  sort_order: number;
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", active: true });
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("sort_order");
    if (data) setProducts(data);
  };

  const handleSave = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      active: form.active,
    };

    if (editing) {
      await supabase.from("products").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("products").insert(payload);
    }
    setEditing(null);
    setForm({ name: "", description: "", price: "", active: true });
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      active: product.active,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await supabase.from("products").delete().eq("id", id);
      fetchProducts();
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= products.length) return;

    const a = products[index];
    const b = products[swapIndex];

    await Promise.all([
      supabase.from("products").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("products").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    fetchProducts();
  };

  const handleImageUpload = async (product: Product, file: File) => {
    setUploadingImage(product.id);
    try {
      let uploadData: Blob | File = file;
      try {
        uploadData = await compressImage(file);
      } catch {
        // Use original if compression fails
      }

      const fileName = `products/${product.id}-${Date.now()}.jpg`;
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
        .from("products")
        .update({ image_url: urlData.publicUrl })
        .eq("id", product.id);

      fetchProducts();
    } finally {
      setUploadingImage(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      {/* Form */}
      <div className="bg-card-bg border border-border p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">
          {editing ? "Edit Product" : "Add Product"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Product name"
            className="bg-background border border-border px-4 py-2 text-foreground focus:outline-none focus:border-sage"
          />
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            className="bg-background border border-border px-4 py-2 text-foreground focus:outline-none focus:border-sage"
          />
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Price (NZD)"
            className="bg-background border border-border px-4 py-2 text-foreground focus:outline-none focus:border-sage"
          />
        </div>
        <div className="flex items-center gap-4 mt-4">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="accent-sage"
            />
            Active
          </label>
          <button
            onClick={handleSave}
            disabled={!form.name || !form.price}
            className="px-5 py-2 bg-sage text-background text-sm tracking-wider uppercase font-medium hover:bg-sage-dark transition-colors disabled:opacity-50"
          >
            {editing ? "Update" : "Add"}
          </button>
          {editing && (
            <button
              onClick={() => {
                setEditing(null);
                setForm({ name: "", description: "", price: "", active: true });
              }}
              className="text-muted text-sm hover:text-foreground"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Product Cards */}
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={product.id} className="bg-card-bg border border-border p-6">
            <div className="flex items-start gap-4">
              {/* Reorder buttons */}
              <div className="flex flex-col gap-1 shrink-0 pt-2">
                <button
                  onClick={() => handleMove(index, "up")}
                  disabled={index === 0}
                  className="text-muted hover:text-foreground disabled:opacity-20 transition-colors text-lg leading-none"
                  title="Move up"
                >
                  ▲
                </button>
                <button
                  onClick={() => handleMove(index, "down")}
                  disabled={index === products.length - 1}
                  className="text-muted hover:text-foreground disabled:opacity-20 transition-colors text-lg leading-none"
                  title="Move down"
                >
                  ▼
                </button>
              </div>

              {/* Image */}
              <div className="shrink-0">
                <div className="relative w-24 h-24 overflow-hidden bg-black/20 mb-2">
                  <Image
                    src={product.image_url || "/images/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <label className="block text-center px-2 py-1 text-xs text-sage hover:text-sage-dark cursor-pointer transition-colors">
                  {uploadingImage === product.id ? "Uploading..." : "Change Image"}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    disabled={uploadingImage === product.id}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(product, file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                    <p className="text-muted text-sm mb-1">{product.description}</p>
                    <p className="text-sage font-bold">${product.price}</p>
                    <span className={`text-xs uppercase mt-2 inline-block ${product.active ? "text-sage" : "text-muted"}`}>
                      {product.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex gap-3 shrink-0 ml-4">
                    <button onClick={() => handleEdit(product)} className="text-sage text-sm hover:text-sage-dark">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-400 text-sm hover:text-red-300">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="text-muted text-sm">No products yet.</p>
        )}
      </div>
    </div>
  );
}

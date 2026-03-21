"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  active: boolean;
  sort_order: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", active: true });

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

      {/* Table */}
      <div className="bg-card-bg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="p-4 text-xs uppercase tracking-wider text-muted">Name</th>
              <th className="p-4 text-xs uppercase tracking-wider text-muted">Description</th>
              <th className="p-4 text-xs uppercase tracking-wider text-muted">Price</th>
              <th className="p-4 text-xs uppercase tracking-wider text-muted">Status</th>
              <th className="p-4 text-xs uppercase tracking-wider text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border">
                <td className="p-4 text-sm">{product.name}</td>
                <td className="p-4 text-sm text-muted">{product.description}</td>
                <td className="p-4 text-sm">${product.price}</td>
                <td className="p-4">
                  <span className={`text-xs uppercase ${product.active ? "text-sage" : "text-muted"}`}>
                    {product.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(product)} className="text-sage text-sm hover:text-sage-dark">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-400 text-sm hover:text-red-300">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

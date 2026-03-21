"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Testimonial {
  id: string;
  name: string;
  text: string;
  active: boolean;
  sort_order: number;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ name: "", text: "", active: true });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order");
    if (data) setTestimonials(data);
  };

  const handleSave = async () => {
    const payload = { name: form.name, text: form.text, active: form.active };
    if (editing) {
      await supabase.from("testimonials").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("testimonials").insert(payload);
    }
    setEditing(null);
    setForm({ name: "", text: "", active: true });
    fetchTestimonials();
  };

  const handleEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ name: t.name, text: t.text, active: t.active });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this testimonial?")) {
      await supabase.from("testimonials").delete().eq("id", id);
      fetchTestimonials();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Testimonials</h1>

      <div className="bg-card-bg border border-border p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">
          {editing ? "Edit Testimonial" : "Add Testimonial"}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Client name"
            className="w-full bg-background border border-border px-4 py-2 text-foreground focus:outline-none focus:border-sage"
          />
          <textarea
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            placeholder="Their testimonial..."
            rows={3}
            className="w-full bg-background border border-border px-4 py-2 text-foreground focus:outline-none focus:border-sage resize-none"
          />
          <div className="flex items-center gap-4">
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
              disabled={!form.name || !form.text}
              className="px-5 py-2 bg-sage text-background text-sm tracking-wider uppercase font-medium hover:bg-sage-dark transition-colors disabled:opacity-50"
            >
              {editing ? "Update" : "Add"}
            </button>
            {editing && (
              <button
                onClick={() => {
                  setEditing(null);
                  setForm({ name: "", text: "", active: true });
                }}
                className="text-muted text-sm hover:text-foreground"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-card-bg border border-border p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm italic text-muted leading-relaxed mb-3">
                  &ldquo;{t.text}&rdquo;
                </p>
                <p className="text-sage text-sm font-medium">— {t.name}</p>
              </div>
              <div className="flex gap-3 ml-4 shrink-0">
                <span className={`text-xs uppercase ${t.active ? "text-sage" : "text-muted"}`}>
                  {t.active ? "Active" : "Hidden"}
                </span>
                <button onClick={() => handleEdit(t)} className="text-sage text-sm hover:text-sage-dark">
                  Edit
                </button>
                <button onClick={() => handleDelete(t.id)} className="text-red-400 text-sm hover:text-red-300">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

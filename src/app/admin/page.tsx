"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Stats {
  enquiries: number;
  newEnquiries: number;
  artists: number;
  products: number;
  testimonials: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    enquiries: 0,
    newEnquiries: 0,
    artists: 0,
    products: 0,
    testimonials: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [enquiries, newEnquiries, artists, products, testimonials] =
        await Promise.all([
          supabase.from("enquiries").select("id", { count: "exact", head: true }),
          supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("artists").select("id", { count: "exact", head: true }),
          supabase.from("products").select("id", { count: "exact", head: true }),
          supabase.from("testimonials").select("id", { count: "exact", head: true }),
        ]);

      setStats({
        enquiries: enquiries.count || 0,
        newEnquiries: newEnquiries.count || 0,
        artists: artists.count || 0,
        products: products.count || 0,
        testimonials: testimonials.count || 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: "New Enquiries",
      value: stats.newEnquiries,
      total: stats.enquiries,
      href: "/admin/enquiries",
      highlight: stats.newEnquiries > 0,
    },
    { label: "Artists", value: stats.artists, href: "/admin/artists" },
    { label: "Products", value: stats.products, href: "/admin/products" },
    { label: "Testimonials", value: stats.testimonials, href: "/admin/testimonials" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`bg-card-bg border p-6 hover:border-sage transition-colors ${
              card.highlight ? "border-sage" : "border-border"
            }`}
          >
            <p className="text-muted text-sm tracking-wider uppercase mb-2">
              {card.label}
            </p>
            <p className="text-3xl font-bold">{card.value}</p>
            {"total" in card && (
              <p className="text-muted text-xs mt-1">
                of {card.total} total
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

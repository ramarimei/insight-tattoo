"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const products = [
  {
    id: "tui-tattoo",
    name: "Tui Tattoo",
    price: 400,
    image: "/images/gallery/shop/IMG_8810-1-scaled.jpeg",
    description: "Beautiful NZ Tui bird design",
  },
  {
    id: "medium-back-piece",
    name: "Medium Back Piece",
    price: 650,
    image: "/images/gallery/shop/IMG_20250322_140209_edit_1154720553962862.jpeg",
    description: "Medium size back tattoo design",
  },
  {
    id: "wrist-floral",
    name: "Wrist Floral",
    price: 280,
    image: "/images/gallery/shop/IMG_20230831_175239-scaled.jpeg",
    description: "Delicate floral wrist piece",
  },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const cancelled = searchParams.get("cancelled");
  const [loading, setLoading] = useState<string | null>(null);

  const handleBuy = async (product: (typeof products)[0]) => {
    setLoading(product.id);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.name,
          price: product.price,
          productId: product.id,
        }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setLoading(null);
    }
  };

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="py-20 px-6 text-center">
        <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">
          Flash & Designs
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Shop</h1>
      </section>

      {/* Success/Cancel Messages */}
      {success && (
        <div className="max-w-3xl mx-auto px-6 mb-8">
          <div className="bg-card-bg border border-sage/30 p-6 text-center">
            <h3 className="text-xl font-bold text-sage mb-2">
              Payment Successful!
            </h3>
            <p className="text-muted text-sm">
              Thanks for your purchase. We&apos;ll be in touch to arrange your
              appointment.
            </p>
          </div>
        </div>
      )}
      {cancelled && (
        <div className="max-w-3xl mx-auto px-6 mb-8">
          <div className="bg-card-bg border border-border p-6 text-center">
            <p className="text-muted text-sm">
              Payment was cancelled. No worries — your design will still be here
              when you&apos;re ready.
            </p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="relative aspect-square overflow-hidden mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="text-lg font-medium mb-1">{product.name}</h3>
              <p className="text-muted text-sm mb-2">{product.description}</p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-accent text-lg font-bold">
                  ${product.price.toLocaleString()}
                </p>
                <button
                  onClick={() => handleBuy(product)}
                  disabled={loading === product.id}
                  className="px-5 py-2 bg-sage text-background text-sm tracking-wider uppercase font-medium hover:bg-sage-dark transition-colors duration-300 disabled:opacity-70 disabled:cursor-wait flex items-center gap-2"
                >
                  {loading === product.id ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Buy Now"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-16 text-center bg-card-bg border border-border p-8">
          <h2 className="text-xl font-bold mb-4">Custom Designs</h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Looking for something unique? Our artists create custom designs
            tailored to your vision. Email us with your idea, placement, and
            size for a personalised quote.
          </p>
          <Link
            href="/contact"
            className="px-8 py-3 bg-sage text-background text-sm tracking-wider uppercase font-medium hover:bg-sage-dark transition-colors duration-300 inline-block"
          >
            Get a Quote
          </Link>
        </div>

        {/* Afterpay note */}
        <div className="max-w-3xl mx-auto mt-8 text-center">
          <p className="text-muted text-xs">
            Afterpay available at checkout — pay in 4 interest-free instalments
          </p>
        </div>
      </section>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}

import Image from "next/image";
import Link from "next/link";

const products = [
  {
    name: "Tui Tattoo",
    price: 400,
    image: "/images/gallery/shop/IMG_8810-1-scaled.jpeg",
    description: "Beautiful NZ Tui bird design",
  },
  {
    name: "Medium Back Piece",
    price: 650,
    image: "/images/gallery/shop/IMG_20250322_140209_edit_1154720553962862.jpeg",
    description: "Medium size back tattoo design",
  },
  {
    name: "Wrist Floral",
    price: 280,
    image: "/images/gallery/shop/IMG_20230831_175239-scaled.jpeg",
    description: "Delicate floral wrist piece",
  },
];

export default function ShopPage() {
  return (
    <div className="pt-24">
      {/* Header */}
      <section className="py-20 px-6 text-center">
        <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">
          Flash & Designs
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Shop</h1>
      </section>

      {/* Products Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.name} className="group">
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
              <p className="text-accent text-lg font-bold">
                ${product.price.toLocaleString()}
              </p>
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
            className="px-8 py-3 bg-accent text-background text-sm tracking-wider uppercase font-medium hover:bg-accent-hover transition-colors duration-300 inline-block"
          >
            Get a Quote
          </Link>
        </div>
      </section>
    </div>
  );
}

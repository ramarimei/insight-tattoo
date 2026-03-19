import Image from "next/image";
import Link from "next/link";

const artists = [
  {
    name: "Renee",
    specialty: "Watercolour, NZ Native Birds, Floral",
    image: "/images/generated/hero-ink.jpeg",
    href: "/artists#renee",
  },
  {
    name: "Ash",
    specialty: "Illustrative, Geometric, Hand Tattoos",
    image: "/images/generated/hero-ink.jpeg",
    href: "/artists#ash",
  },
  {
    name: "Fae",
    specialty: "Flash Designs, Custom, Botanical",
    image: "/images/generated/hero-ink.jpeg",
    href: "/artists#fae",
  },
];

const galleryImages = [
  { src: "/images/generated/hero-studio.jpeg", alt: "Tattoo studio" },
  { src: "/images/generated/hero-ink.jpeg", alt: "Tattoo machine" },
  { src: "/images/generated/bg-dark.jpeg", alt: "Studio atmosphere" },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/generated/hero-studio.jpeg"
            alt="Insight Tattoo Studio"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl animate-fade-in">
          <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">
            Est. 2016 &mdash; Whangarei, New Zealand
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            INSIGHT
            <br />
            <span className="text-accent">TATTOO</span>
          </h1>
          <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            A welcoming, female-led tattoo studio where ideas are talked through,
            designs are carefully developed, and tattoos are created with meaning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3 bg-accent text-background text-sm tracking-wider uppercase font-medium hover:bg-accent-hover transition-colors duration-300"
            >
              Book an Appointment
            </Link>
            <Link
              href="/artists"
              className="px-8 py-3 border border-foreground/30 text-sm tracking-wider uppercase font-medium hover:bg-foreground/10 transition-colors duration-300"
            >
              View Artists
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-accent rounded-full" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">
              Our Studio
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Where Art
              <br />
              Meets Skin
            </h2>
            <p className="text-muted leading-relaxed mb-6">
              Based in the heart of Kamo, Whangarei, Insight Tattoo Studio has been
              creating meaningful tattoos since 2016. Our female-led team of artists
              brings a warm, welcoming environment where every design is carefully
              developed to tell your story.
            </p>
            <p className="text-muted leading-relaxed mb-8">
              Whether you&apos;re looking for a delicate floral piece, a bold
              statement tattoo, or a custom design that captures something truly
              personal — our artists will work with you every step of the way.
            </p>
            <Link
              href="/pricing"
              className="text-accent text-sm tracking-wider uppercase hover:text-accent-hover transition-colors"
            >
              View Pricing &rarr;
            </Link>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/generated/hero-ink.jpeg"
              alt="Tattoo artistry"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Artists Section */}
      <section className="py-24 px-6 bg-card-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">
              Meet the Team
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Our Artists
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {artists.map((artist) => (
              <Link
                key={artist.name}
                href={artist.href}
                className="group relative aspect-[3/4] overflow-hidden"
              >
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold mb-1">{artist.name}</h3>
                  <p className="text-muted text-sm">{artist.specialty}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/artists"
              className="text-accent text-sm tracking-wider uppercase hover:text-accent-hover transition-colors"
            >
              View All Galleries &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">
              Our Work
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Recent Pieces
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="relative aspect-square overflow-hidden group"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/generated/bg-dark.jpeg"
            alt="Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to Get Inked?
          </h2>
          <p className="text-muted text-lg mb-10 leading-relaxed">
            Book your appointment today. We&apos;d love to hear your ideas and help
            bring them to life.
          </p>
          <Link
            href="/contact"
            className="px-8 py-3 bg-accent text-background text-sm tracking-wider uppercase font-medium hover:bg-accent-hover transition-colors duration-300"
          >
            Book an Appointment
          </Link>
        </div>
      </section>

      {/* Info Bar */}
      <section className="py-16 px-6 bg-card-bg">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="text-accent text-sm tracking-[0.3em] uppercase mb-3">
              Location
            </h3>
            <p className="text-muted text-sm">428 Te Kamo Rd</p>
            <p className="text-muted text-sm">Kamo, Whangarei</p>
          </div>
          <div>
            <h3 className="text-accent text-sm tracking-[0.3em] uppercase mb-3">
              Contact
            </h3>
            <p className="text-muted text-sm">09 971 9067</p>
            <p className="text-muted text-sm">info@insighttattoo.co.nz</p>
          </div>
          <div>
            <h3 className="text-accent text-sm tracking-[0.3em] uppercase mb-3">
              Follow Us
            </h3>
            <p className="text-muted text-sm">Instagram: @insight_tattoo_nz</p>
            <p className="text-muted text-sm">Facebook: /insighttattoo.co.nz</p>
          </div>
        </div>
      </section>
    </>
  );
}

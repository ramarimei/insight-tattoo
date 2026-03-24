import Image from "next/image";
import Link from "next/link";
import {
  getSiteContent,
  getSiteAssets,
  getArtists,
  getGalleryImages,
  getTestimonials,
} from "@/lib/site-data";

export const revalidate = 60;

export default async function Home() {
  const [content, assets, artists, galleryImages, testimonials] =
    await Promise.all([
      getSiteContent(),
      getSiteAssets(),
      getArtists(),
      getGalleryImages(),
      getTestimonials(),
    ]);

  // Pick 6 most recent gallery images for preview
  const previewImages = galleryImages.slice(0, 6);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={assets.hero_image}
            alt="Insight Tattoo Studio"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <p className="text-sage text-sm tracking-[0.3em] uppercase mb-6">
            {content.hero_tagline || "Est. 2016 — Whangarei, New Zealand"}
          </p>
          <h1 className="mb-8">
            <Image
              src={assets.hero_logo}
              alt="Insight Tattoo Studio"
              width={800}
              height={280}
              className="mx-auto w-full max-w-2xl md:max-w-3xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
              priority
            />
          </h1>
          <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {content.hero_description ||
              "A welcoming, female-led tattoo studio where ideas are talked through, designs are carefully developed, and tattoos are created with meaning."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3 bg-sage text-background text-sm tracking-wider uppercase font-medium hover:bg-sage-dark transition-colors duration-300"
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
      </section>

      {/* Studio Hours */}
      <section className="py-12 px-6 bg-card-bg border-b border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <h3 className="text-sage text-xs tracking-[0.2em] uppercase mb-2">
              Mon – Wed
            </h3>
            <p className="text-foreground text-sm">
              {content.hours_mon_wed || "9am – 3pm"}
            </p>
          </div>
          <div>
            <h3 className="text-sage text-xs tracking-[0.2em] uppercase mb-2">
              Thu – Fri
            </h3>
            <p className="text-foreground text-sm">
              {content.hours_thu_fri || "9am – 5pm"}
            </p>
          </div>
          <div>
            <h3 className="text-sage text-xs tracking-[0.2em] uppercase mb-2">
              Saturday
            </h3>
            <p className="text-foreground text-sm">
              {content.hours_saturday || "9am – 3pm"}
            </p>
          </div>
          <div>
            <h3 className="text-sage text-xs tracking-[0.2em] uppercase mb-2">
              Sunday
            </h3>
            <p className="text-foreground text-sm">
              {content.hours_sunday || "By Appointment"}
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sage text-sm tracking-[0.3em] uppercase mb-4">
              Our Studio
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {content.about_heading || "Where Art Meets Skin"}
            </h2>
            <p className="text-muted leading-relaxed mb-6">
              {content.about_text_1 || ""}
            </p>
            <p className="text-muted leading-relaxed mb-8">
              {content.about_text_2 || ""}
            </p>
            <Link
              href="/pricing"
              className="text-sage text-sm tracking-wider uppercase hover:text-sage-dark transition-colors"
            >
              View Pricing &rarr;
            </Link>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={assets.about_image}
              alt="Insight Tattoo Studio"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Fantail Divider */}
      <section className="relative w-full overflow-hidden">
        <Image
          src={assets.divider_art}
          alt="Decorative divider"
          width={2000}
          height={400}
          className="w-full h-auto"
        />
      </section>

      {/* Artists Section */}
      <section className="py-24 px-6 bg-card-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sage text-sm tracking-[0.3em] uppercase mb-4">
              Meet the Team
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Our Artists
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artists#${artist.slug}`}
                className="group relative aspect-[3/4] overflow-hidden"
              >
                <Image
                  src={artist.avatar_url || "/images/placeholder.jpg"}
                  alt={artist.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold mb-1">{artist.name}</h3>
                  <p className="text-muted text-sm">
                    {artist.specialties?.join(", ") || ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/artists"
              className="text-sage text-sm tracking-wider uppercase hover:text-sage-dark transition-colors"
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
            <p className="text-sage text-sm tracking-[0.3em] uppercase mb-4">
              Our Work
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Recent Pieces
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {previewImages.map((img) => (
              <div
                key={img.id}
                className="relative aspect-[3/4] overflow-hidden group"
              >
                <Image
                  src={img.image_url}
                  alt={img.title || "Gallery image"}
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
            src={assets.cta_background}
            alt="Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            {content.cta_heading || "Ready to Get Inked?"}
          </h2>
          <p className="text-muted text-lg mb-10 leading-relaxed">
            {content.cta_description || ""}
          </p>
          <Link
            href="/contact"
            className="px-8 py-3 bg-sage text-background text-sm tracking-wider uppercase font-medium hover:bg-sage-dark transition-colors duration-300"
          >
            Book an Appointment
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-sage text-sm tracking-[0.3em] uppercase mb-4">
                What Our Clients Say
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Testimonials
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-card-bg border border-border p-8"
                >
                  <p className="text-muted text-sm leading-relaxed mb-6 italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <p className="text-sage text-sm font-medium">
                    — {testimonial.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Info Bar */}
      <section className="py-16 px-6 bg-card-bg">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="text-sage text-sm tracking-[0.3em] uppercase mb-3">
              Location
            </h3>
            <p className="text-muted text-sm">
              {content.contact_address_line1 || "428 Te Kamo Rd"}
            </p>
            <p className="text-muted text-sm">
              {content.contact_address_line2 || "Kamo, Whangarei"}
            </p>
          </div>
          <div>
            <h3 className="text-sage text-sm tracking-[0.3em] uppercase mb-3">
              Contact
            </h3>
            <p className="text-muted text-sm">
              {content.contact_phone || "09 971 9067"}
            </p>
            <p className="text-muted text-sm">
              {content.contact_email || "info@insighttattoo.co.nz"}
            </p>
          </div>
          <div>
            <h3 className="text-sage text-sm tracking-[0.3em] uppercase mb-3">
              Follow Us
            </h3>
            <p className="text-muted text-sm">
              Instagram: {content.contact_instagram_handle || "@insight_tattoo_nz"}
            </p>
            <p className="text-muted text-sm">
              Facebook: {content.contact_facebook_handle || "/insighttattoo.co.nz"}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

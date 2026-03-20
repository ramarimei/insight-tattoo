import Image from "next/image";

const artists = [
  {
    id: "renee",
    name: "Renee",
    avatar: "/images/generated/artist-renee.jpeg",
    bio: "Studio owner and lead artist since 2016. Renee specialises in watercolour work, NZ native birds, floral designs, and contemporary Maori-inspired pieces. Large-scale work in preferred styles receives discounted hourly rates.",
    contact: "info@insighttattoo.co.nz",
    availability: "Books open — appointments available",
    gallery: [
      "/images/generated/hero-ink.jpeg",
      "/images/generated/hero-studio.jpeg",
      "/images/generated/bg-dark.jpeg",
    ],
  },
  {
    id: "ash",
    name: "Ash",
    avatar: "/images/generated/artist-ash.jpeg",
    bio: "Ash brings a bold illustrative style to the studio, specialising in geometric designs, hand tattoos, and detailed black work. Walk-ins welcome on Thursdays from 9am.",
    contact: "ashink.tattoos@icloud.com",
    availability: "Wed, Fri, Sat by appointment. Thu walk-ins from 9am.",
    gallery: [
      "/images/generated/hero-studio.jpeg",
      "/images/generated/hero-ink.jpeg",
      "/images/generated/bg-dark.jpeg",
    ],
  },
  {
    id: "fae",
    name: "Fae",
    avatar: "/images/generated/artist-fae.jpeg",
    bio: "Fae creates beautiful flash designs and custom pieces with a focus on botanical, geometric, and illustrative styles. Flash designs are regularly posted on the Insight Facebook page.",
    contact: "fwolfepine@gmail.com",
    availability: "Mon, Thu, Sat. Flash and custom designs available.",
    gallery: [
      "/images/generated/bg-dark.jpeg",
      "/images/generated/hero-ink.jpeg",
      "/images/generated/hero-studio.jpeg",
    ],
  },
];

export default function ArtistsPage() {
  return (
    <div className="pt-24">
      {/* Header */}
      <section className="py-20 px-6 text-center">
        <p className="text-sage text-sm tracking-[0.3em] uppercase mb-4">
          Meet the Team
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
          Our Artists
        </h1>
        <div className="max-w-2xl mx-auto">
          <Image
            src="/images/artists-artwork.jpg"
            alt="Renee, Fae, and Ash — illustrated by Renee"
            width={600}
            height={600}
            className="w-full h-auto mx-auto"
          />
          <p className="text-muted text-sm mt-4 italic">Artwork by Renee</p>
        </div>
      </section>

      {/* Artist Sections */}
      {artists.map((artist, index) => (
        <section
          key={artist.id}
          id={artist.id}
          className={`py-20 px-6 ${index % 2 === 1 ? "bg-card-bg" : ""}`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-48 h-64 relative shrink-0 overflow-hidden">
                <Image
                  src={artist.avatar}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                {artist.name}
              </h2>
              <p className="text-muted leading-relaxed max-w-2xl mb-4">
                {artist.bio}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 text-sm text-muted">
                <p>
                  <span className="text-accent">Availability:</span>{" "}
                  {artist.availability}
                </p>
                <p>
                  <span className="text-accent">Contact:</span>{" "}
                  <a
                    href={`mailto:${artist.contact}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {artist.contact}
                  </a>
                </p>
              </div>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {artist.gallery.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden group"
                >
                  <Image
                    src={img}
                    alt={`${artist.name} tattoo work ${i + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

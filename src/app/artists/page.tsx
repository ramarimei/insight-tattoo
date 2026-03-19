import Image from "next/image";

const artists = [
  {
    id: "renee",
    name: "Renee",
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
        <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">
          Meet the Team
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Our Artists
        </h1>
      </section>

      {/* Artist Sections */}
      {artists.map((artist, index) => (
        <section
          key={artist.id}
          id={artist.id}
          className={`py-20 px-6 ${index % 2 === 1 ? "bg-card-bg" : ""}`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
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

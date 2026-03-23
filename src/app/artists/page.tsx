import Image from "next/image";

const artists = [
  {
    id: "renee",
    name: "Renee",
    avatar: "/images/artist-renee.jpg",
    bio: "Studio owner and lead artist since 2016. Renee specialises in watercolour work, NZ native birds, floral designs, and contemporary Maori-inspired pieces. Large-scale work in preferred styles receives discounted hourly rates.",
    contact: "info@insighttattoo.co.nz",
    availability: "Books open — appointments available",
    gallery: [
      "/images/gallery/renee/D7C1F904-B4CD-4E36-AB49-AD3C4491027F-scaled-e1712367925322.jpeg",
      "/images/gallery/renee/Fantail-Heart-Tattoo.jpg",
      "/images/gallery/renee/7B21628B-5323-4D27-AE55-779624B9345F.jpeg",
      "/images/gallery/renee/DE8D24D5-AC95-4EC2-B041-E0893430143F-872x1024.jpeg",
      "/images/gallery/renee/FullSizeRender-768x1024.jpeg",
      "/images/gallery/renee/3FF2A5C1-D64C-450A-8347-FC0592591201.jpeg",
      "/images/gallery/renee/10D6C4BA-0493-4776-BB96-22FB7F66A5E7-768x1024.jpeg",
      "/images/gallery/renee/FullSizeRender-3-768x1024.jpeg",
      "/images/gallery/renee/17FC5B5B-16B4-48C3-A838-D77A81A71936-768x1024.jpeg",
    ],
  },
  {
    id: "ash",
    name: "Ash",
    avatar: "/images/artist-ash.jpg",
    bio: "Ash brings a bold illustrative style to the studio, specialising in geometric designs, hand tattoos, and detailed black work. Walk-ins welcome on Thursdays from 9am.",
    contact: "ashink.tattoos@icloud.com",
    availability: "Wed, Fri, Sat by appointment. Thu walk-ins from 9am.",
    gallery: [
      "/images/gallery/ash/IMG_6716-1024x859.jpeg",
      "/images/gallery/ash/IMG_6717-724x1024.jpeg",
      "/images/gallery/ash/IMG_6718-518x1024.jpeg",
      "/images/gallery/ash/IMG_6719-671x1024.jpeg",
      "/images/gallery/ash/IMG_6720-885x1024.jpeg",
      "/images/gallery/ash/IMG_6721-1-781x1024.jpeg",
      "/images/gallery/ash/img_3157-2-768x1024.jpg",
      "/images/gallery/ash/IMG_7796.jpeg",
      "/images/gallery/ash/58E86534-61CA-40D1-B99A-D1092885E952-768x1024.jpeg",
    ],
  },
  {
    id: "fae",
    name: "Fae",
    avatar: "/images/artist-fae.jpg",
    bio: "Fae creates beautiful flash designs and custom pieces with a focus on botanical, geometric, and illustrative styles. Flash designs are regularly posted on the Insight Facebook page.",
    contact: "fwolfepine@gmail.com",
    availability: "Mon, Thu, Sat. Flash and custom designs available.",
    gallery: [
      "/images/gallery/fae/IMG_7354.jpeg",
      "/images/gallery/fae/IMG_7792.jpeg",
      "/images/gallery/fae/IMG_20240624_114337-768x1024.jpeg",
      "/images/gallery/fae/20240803_1516470_edit_234097105952297-1-768x1024.jpeg",
      "/images/gallery/fae/20241003_154446_edit_45133722432174-818x1024.jpeg",
      "/images/gallery/fae/IMG_20250322_140209_edit_1154720553962862-688x1024.jpeg",
      "/images/gallery/fae/IMG_20250426_122006_1_edit_660654629506479-582x1024.jpeg",
      "/images/gallery/fae/image3_edit_1545956445302634-1-768x1024.jpeg",
      "/images/gallery/fae/20250106_131739-647x1024.jpeg",
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
        <div className="max-w-3xl mx-auto overflow-hidden">
          <Image
            src="/images/team-artists.jpg"
            alt="Fae, Ash, and Renee at Insight Tattoo Studio"
            width={800}
            height={600}
            className="w-full h-auto mx-auto"
          />
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

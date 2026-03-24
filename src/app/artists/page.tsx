import Image from "next/image";
import { getArtists, getGalleryImages, getSiteAssets } from "@/lib/site-data";

export const revalidate = 60;

export default async function ArtistsPage() {
  const [artists, galleryImages, assets] = await Promise.all([
    getArtists(),
    getGalleryImages(),
    getSiteAssets(),
  ]);

  // Group gallery images by artist
  const galleryByArtist: Record<string, typeof galleryImages> = {};
  for (const img of galleryImages) {
    if (!galleryByArtist[img.artist_id]) galleryByArtist[img.artist_id] = [];
    galleryByArtist[img.artist_id].push(img);
  }

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
        {assets.team_photo && (
          <div className="max-w-3xl mx-auto overflow-hidden">
            <Image
              src={assets.team_photo}
              alt="The team at Insight Tattoo Studio"
              width={800}
              height={600}
              className="w-full h-auto mx-auto"
            />
          </div>
        )}
      </section>

      {/* Artist Sections */}
      {artists.map((artist, index) => {
        const artistGallery = galleryByArtist[artist.id] || [];

        return (
          <section
            key={artist.id}
            id={artist.slug}
            className={`py-20 px-6 ${index % 2 === 1 ? "bg-card-bg" : ""}`}
          >
            <div className="max-w-7xl mx-auto">
              <div className="mb-12 flex flex-col md:flex-row gap-8 items-start">
                <div className="w-48 h-64 relative shrink-0 overflow-hidden">
                  <Image
                    src={artist.avatar_url || "/images/placeholder.jpg"}
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
                        href={`mailto:${artist.email}`}
                        className="hover:text-foreground transition-colors"
                      >
                        {artist.email}
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {artistGallery.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-square overflow-hidden group"
                  >
                    <Image
                      src={img.image_url}
                      alt={img.title || `${artist.name} tattoo work`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

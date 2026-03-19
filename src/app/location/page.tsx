export default function LocationPage() {
  return (
    <div className="pt-24">
      {/* Header */}
      <section className="py-20 px-6 text-center">
        <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">
          Find Us
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Location
        </h1>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Map */}
          <div className="aspect-square md:aspect-auto md:min-h-[500px] bg-card-bg border border-border overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3270.7!2d174.3167!3d-35.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s428+Te+Kamo+Road+Whangarei+New+Zealand!5e0!3m2!1sen!2snz!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Insight Tattoo Studio location"
            />
          </div>

          {/* Details */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Visit the Studio</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-accent text-sm tracking-wider uppercase mb-2">
                  Address
                </h3>
                <p className="text-muted">428 Te Kamo Rd</p>
                <p className="text-muted">Kamo, Whangarei</p>
                <p className="text-muted">New Zealand</p>
              </div>

              <div>
                <h3 className="text-accent text-sm tracking-wider uppercase mb-2">
                  Studio Hours
                </h3>
                <div className="space-y-2 text-muted text-sm">
                  <div className="flex justify-between max-w-xs">
                    <span>Monday – Wednesday</span>
                    <span>9am – 3pm</span>
                  </div>
                  <div className="flex justify-between max-w-xs">
                    <span>Thursday – Friday</span>
                    <span>9am – 5pm</span>
                  </div>
                  <div className="flex justify-between max-w-xs">
                    <span>Saturday</span>
                    <span>9am – 3pm</span>
                  </div>
                  <div className="flex justify-between max-w-xs">
                    <span>Sunday</span>
                    <span>By Appointment</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-accent text-sm tracking-wider uppercase mb-2">
                  Getting Here
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  We&apos;re located on Te Kamo Road in the Kamo village area.
                  Free parking is available outside the studio. ATMs are
                  available nearby in Kamo village.
                </p>
              </div>

              <div>
                <h3 className="text-accent text-sm tracking-wider uppercase mb-2">
                  Contact
                </h3>
                <p className="text-muted text-sm">
                  <a
                    href="tel:099719067"
                    className="hover:text-foreground transition-colors"
                  >
                    09 971 9067
                  </a>
                </p>
                <p className="text-muted text-sm">
                  <a
                    href="mailto:info@insighttattoo.co.nz"
                    className="hover:text-foreground transition-colors"
                  >
                    info@insighttattoo.co.nz
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

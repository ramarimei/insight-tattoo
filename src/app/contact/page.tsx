export default function ContactPage() {
  return (
    <div className="pt-24">
      {/* Header */}
      <section className="py-20 px-6 text-center">
        <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">
          Get In Touch
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Contact
        </h1>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Reach Out</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-accent text-sm tracking-wider uppercase mb-2">
                  Phone
                </h3>
                <p className="text-muted">
                  <a
                    href="tel:099719067"
                    className="hover:text-foreground transition-colors"
                  >
                    09 971 9067
                  </a>
                </p>
                <p className="text-muted text-sm mt-1">
                  Please leave a message if we don&apos;t answer — we&apos;re
                  often in the middle of tattooing.
                </p>
              </div>

              <div>
                <h3 className="text-accent text-sm tracking-wider uppercase mb-2">
                  Email
                </h3>
                <p className="text-muted">
                  <a
                    href="mailto:info@insighttattoo.co.nz"
                    className="hover:text-foreground transition-colors"
                  >
                    info@insighttattoo.co.nz
                  </a>
                </p>
                <p className="text-muted text-sm mt-1">
                  We do get busy answering emails — if you have a delayed
                  response please get back in touch, we may have missed your
                  message.
                </p>
              </div>

              <div>
                <h3 className="text-accent text-sm tracking-wider uppercase mb-2">
                  Artist Direct
                </h3>
                <div className="space-y-2 text-muted text-sm">
                  <p>
                    <span className="text-foreground">Renee:</span>{" "}
                    info@insighttattoo.co.nz
                  </p>
                  <p>
                    <span className="text-foreground">Ash:</span>{" "}
                    ashink.tattoos@icloud.com
                  </p>
                  <p>
                    <span className="text-foreground">Fae:</span>{" "}
                    fwolfepine@gmail.com
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-accent text-sm tracking-wider uppercase mb-2">
                  Social
                </h3>
                <div className="flex gap-6">
                  <a
                    href="https://facebook.com/insighttattoo.co.nz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-accent transition-colors"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://instagram.com/insight_tattoo_nz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-accent transition-colors"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Send a Message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm tracking-wider uppercase text-muted mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full bg-card-bg border border-border px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm tracking-wider uppercase text-muted mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-card-bg border border-border px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm tracking-wider uppercase text-muted mb-2">
                  Artist Preference
                </label>
                <select className="w-full bg-card-bg border border-border px-4 py-3 text-muted focus:outline-none focus:border-accent transition-colors">
                  <option value="">No preference</option>
                  <option value="renee">Renee</option>
                  <option value="ash">Ash</option>
                  <option value="fae">Fae</option>
                </select>
              </div>
              <div>
                <label className="block text-sm tracking-wider uppercase text-muted mb-2">
                  Tell us about your tattoo idea
                </label>
                <textarea
                  rows={5}
                  className="w-full bg-card-bg border border-border px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors resize-none"
                  placeholder="Describe your idea, placement, size, and any reference images..."
                />
              </div>
              <button
                type="submit"
                className="w-full px-8 py-3 bg-accent text-background text-sm tracking-wider uppercase font-medium hover:bg-accent-hover transition-colors duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

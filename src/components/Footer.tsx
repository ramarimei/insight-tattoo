import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-card-bg border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold tracking-widest uppercase mb-4">
              Insight<span className="text-sage">.</span>
            </h3>
            <p className="text-muted text-sm leading-relaxed">
              A welcoming, female-led tattoo studio in Northland. Est. 2016.
            </p>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-sm tracking-wider uppercase font-medium mb-4">
              Studio Hours
            </h4>
            <div className="text-muted text-sm space-y-2">
              <p>Mon–Wed: 9am – 3pm</p>
              <p>Thu–Fri: 9am – 5pm</p>
              <p>Saturday: 9am – 3pm</p>
              <p>Sunday: By Appointment</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm tracking-wider uppercase font-medium mb-4">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { href: "/artists", label: "Artists" },
                { href: "/shop", label: "Shop" },
                { href: "/pricing", label: "Pricing" },
                { href: "/contact", label: "Contact" },
                { href: "/location", label: "Location" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted text-sm hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm tracking-wider uppercase font-medium mb-4">
              Get In Touch
            </h4>
            <div className="text-muted text-sm space-y-2">
              <p>428 Te Kamo Rd, Whangarei</p>
              <p>
                <a
                  href="tel:099719067"
                  className="hover:text-foreground transition-colors"
                >
                  09 971 9067
                </a>
              </p>
              <p>
                <a
                  href="mailto:info@insighttattoo.co.nz"
                  className="hover:text-foreground transition-colors"
                >
                  info@insighttattoo.co.nz
                </a>
              </p>
              <div className="flex gap-4 mt-4">
                <a
                  href="https://facebook.com/insighttattoo.co.nz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-sage transition-colors"
                >
                  Facebook
                </a>
                <a
                  href="https://instagram.com/insight_tattoo_nz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-sage transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-muted text-xs tracking-wider">
          &copy; {new Date().getFullYear()} Insight Tattoo Studio. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}

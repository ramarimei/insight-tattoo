import Link from "next/link";
import { getSiteContent } from "@/lib/site-data";

export default async function Footer() {
  const content = await getSiteContent();

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
              <p>Mon–Wed: {content.hours_mon_wed || "9am – 3pm"}</p>
              <p>Thu–Fri: {content.hours_thu_fri || "9am – 5pm"}</p>
              <p>Saturday: {content.hours_saturday || "9am – 3pm"}</p>
              <p>Sunday: {content.hours_sunday || "By Appointment"}</p>
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
              <p>
                {content.contact_address_line1 || "428 Te Kamo Rd"},{" "}
                {content.contact_address_line2 || "Whangarei"}
              </p>
              <p>
                <a
                  href={`tel:${(content.contact_phone || "09 971 9067").replace(/\s/g, "")}`}
                  className="hover:text-foreground transition-colors"
                >
                  {content.contact_phone || "09 971 9067"}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${content.contact_email || "info@insighttattoo.co.nz"}`}
                  className="hover:text-foreground transition-colors"
                >
                  {content.contact_email || "info@insighttattoo.co.nz"}
                </a>
              </p>
              <div className="flex gap-4 mt-4">
                <a
                  href={content.contact_facebook || "https://facebook.com/insighttattoo.co.nz/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-sage transition-colors"
                >
                  Facebook
                </a>
                <a
                  href={content.contact_instagram || "https://instagram.com/insight_tattoo_nz"}
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

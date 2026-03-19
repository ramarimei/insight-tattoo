import Link from "next/link";

const pricingData = [
  {
    title: "Single Session",
    price: "Per Design",
    description:
      "Email us with your image, placement, and size for a custom quote.",
  },
  {
    title: "Hourly Rate",
    price: "$140/hr",
    description: "For ongoing sessions and larger pieces.",
  },
  {
    title: "Full Day",
    price: "$800",
    description: "Approximately 7 hours. Perfect for large-scale work.",
  },
];

const policies = [
  {
    title: "Booking Deposit",
    text: "$100 non-refundable booking fee required for all appointments. This secures your appointment time.",
  },
  {
    title: "Custom Design Fee",
    text: "A design fee applies for custom artwork. Large designs may take up to 8 hours of preparation, smaller pieces around 2 hours.",
  },
  {
    title: "Cancellation Policy",
    text: "48 hours notice required for cancellations. Cancellations within 48 hours will require the deposit to be paid again.",
  },
  {
    title: "Payment Methods",
    text: "Bank transfers and online bank deposits accepted at the studio. No EFTPOS available. ATMs are available in Kamo village.",
  },
];

export default function PricingPage() {
  return (
    <div className="pt-24">
      {/* Header */}
      <section className="py-20 px-6 text-center">
        <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">
          Transparent Pricing
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Pricing
        </h1>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingData.map((item) => (
            <div
              key={item.title}
              className="bg-card-bg border border-border p-8 text-center"
            >
              <h3 className="text-sm tracking-wider uppercase text-muted mb-4">
                {item.title}
              </h3>
              <p className="text-4xl font-bold text-accent mb-4">
                {item.price}
              </p>
              <p className="text-muted text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Policies */}
      <section className="px-6 pb-24 bg-card-bg py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">
            Policies
          </h2>
          <div className="space-y-8">
            {policies.map((policy) => (
              <div key={policy.title} className="border-b border-border pb-8">
                <h3 className="text-lg font-medium mb-2">{policy.title}</h3>
                <p className="text-muted text-sm leading-relaxed">
                  {policy.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Ready to Book?
        </h2>
        <p className="text-muted mb-8">
          Get in touch with your ideas and we&apos;ll give you a quote.
        </p>
        <Link
          href="/contact"
          className="px-8 py-3 bg-accent text-background text-sm tracking-wider uppercase font-medium hover:bg-accent-hover transition-colors duration-300"
        >
          Contact Us
        </Link>
      </section>
    </div>
  );
}

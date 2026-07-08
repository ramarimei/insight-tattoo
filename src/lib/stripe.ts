import Stripe from "stripe";

// Lazily create the Stripe client so importing this module never constructs it
// at build time (Preview builds have no env vars). Memoised so we reuse one
// client across requests.
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
    });
  }
  return _stripe;
}

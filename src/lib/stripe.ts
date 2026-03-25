import Stripe from "stripe";

// Lazy-init: only creates client when actually called (avoids build-time errors)
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is required");
    _stripe = new Stripe(key, { typescript: true });
  }
  return _stripe;
}

// Keep backward-compat export for existing imports
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

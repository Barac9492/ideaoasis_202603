import Stripe from "stripe";

// Only initialized when API routes are called (server-side only)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  typescript: true,
});

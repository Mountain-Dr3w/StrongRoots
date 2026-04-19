import Stripe from "stripe";

import { env } from "@/env";

let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!env.STRIPE_SECRET_KEY) return null;
  if (cached) return cached;
  cached = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-03-25.dahlia",
    typescript: true,
  });
  return cached;
}

export function requireStripe(): Stripe {
  const stripe = getStripe();
  if (!stripe) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add a test-mode key to .env.local to enable checkout.",
    );
  }
  return stripe;
}

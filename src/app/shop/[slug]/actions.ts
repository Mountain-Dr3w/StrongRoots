"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db, schema } from "@/db";
import { env } from "@/env";
import { getStripe } from "@/lib/stripe";

export async function buyPlanAction(formData: FormData) {
  const productId = formData.get("productId") as string;

  const session = await auth();
  if (!session) {
    redirect(`/signin?callbackUrl=${encodeURIComponent(`/shop`)}`);
  }

  const product = await db.query.products.findFirst({
    where: eq(schema.products.id, productId),
  });
  if (!product || !product.active || product.type !== "plan") {
    redirect("/shop");
  }

  const stripe = getStripe();
  if (!stripe || !product.stripePriceId) {
    redirect(`/checkout/stub?productId=${encodeURIComponent(productId)}`);
  }

  const baseUrl = env.AUTH_URL ?? "http://localhost:3000";
  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: product.stripePriceId, quantity: 1 }],
    success_url: `${baseUrl}/account/library?purchase=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/shop/${product.slug}`,
    client_reference_id: session.user.id,
    customer_email: session.user.email ?? undefined,
    metadata: { productId: product.id, userId: session.user.id },
  });

  if (!checkout.url) {
    throw new Error("Stripe Checkout session returned without a URL");
  }

  redirect(checkout.url);
}

export async function bookConsultingAction(formData: FormData) {
  const slug = formData.get("slug") as string;
  redirect(`/book/${encodeURIComponent(slug)}`);
}

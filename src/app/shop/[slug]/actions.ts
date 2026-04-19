"use server";

import { redirect } from "next/navigation";

export async function buyPlanAction(formData: FormData) {
  const productId = formData.get("productId") as string;
  // Full Stripe Checkout implementation lives in BD-006. For now, route to a
  // placeholder that BD-006 replaces with a real createCheckoutSession call.
  redirect(`/checkout/stub?productId=${encodeURIComponent(productId)}`);
}

export async function bookConsultingAction(formData: FormData) {
  const slug = formData.get("slug") as string;
  // Full booking flow lives in BD-008. For now, route to /book/[slug].
  redirect(`/book/${encodeURIComponent(slug)}`);
}

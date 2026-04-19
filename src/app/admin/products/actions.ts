"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { db, schema } from "@/db";
import { getStripe } from "@/lib/stripe";

async function syncStripePrice(
  productId: string,
  priceCents: number,
  name: string,
  existingPriceId: string | null,
): Promise<string | null> {
  const stripe = getStripe();
  if (!stripe) return existingPriceId;

  const price = await stripe.prices.create({
    unit_amount: priceCents,
    currency: "usd",
    product_data: { name },
    metadata: { productId },
  });
  return price.id;
}

export async function createProductAction(formData: FormData) {
  const type = formData.get("type") as "plan" | "consulting";
  const slug = (formData.get("slug") as string).trim();
  const name = (formData.get("name") as string).trim();
  const description = ((formData.get("description") as string) ?? "").trim() || null;
  const priceCents = Math.round(Number(formData.get("priceCents") ?? 0));

  const [product] = await db
    .insert(schema.products)
    .values({
      type,
      slug,
      name,
      description,
      priceCents,
      active: true,
    })
    .returning({ id: schema.products.id });

  const stripePriceId = await syncStripePrice(product.id, priceCents, name, null);
  if (stripePriceId) {
    await db
      .update(schema.products)
      .set({ stripePriceId })
      .where(eq(schema.products.id, product.id));
  }

  if (type === "plan") {
    const weeks = Math.max(1, Math.round(Number(formData.get("weeks") ?? 8)));
    const level = (formData.get("level") as "beginner" | "intermediate" | "advanced") ?? "beginner";
    await db.insert(schema.plans).values({
      productId: product.id,
      weeks,
      level,
    });
  } else {
    const durationMinutes = Math.max(15, Math.round(Number(formData.get("durationMinutes") ?? 60)));
    const requiresIntake = formData.get("requiresIntake") === "on";
    const requiresDeposit = formData.get("requiresDeposit") === "on";
    await db.insert(schema.consultingOfferings).values({
      productId: product.id,
      durationMinutes,
      requiresIntake,
      requiresDeposit,
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function updateProductAction(formData: FormData) {
  const id = formData.get("id") as string;
  const name = (formData.get("name") as string).trim();
  const description = ((formData.get("description") as string) ?? "").trim() || null;
  const priceCents = Math.round(Number(formData.get("priceCents") ?? 0));
  const active = formData.get("active") === "on";

  const existing = await db.query.products.findFirst({ where: eq(schema.products.id, id) });
  if (!existing) redirect("/admin/products");

  await db
    .update(schema.products)
    .set({ name, description, priceCents, active, updatedAt: new Date() })
    .where(eq(schema.products.id, id));

  if (existing.priceCents !== priceCents) {
    const newStripePriceId = await syncStripePrice(id, priceCents, name, existing.stripePriceId);
    if (newStripePriceId) {
      await db
        .update(schema.products)
        .set({ stripePriceId: newStripePriceId })
        .where(eq(schema.products.id, id));
    }
  }

  revalidatePath("/admin/products");
  revalidatePath(`/shop/${existing.slug}`);
  redirect("/admin/products");
}

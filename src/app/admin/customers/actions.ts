"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";

import { db, schema } from "@/db";

export async function grantEntitlementAction(formData: FormData) {
  const userId = formData.get("userId") as string;
  const productId = formData.get("productId") as string;

  const existing = await db.query.entitlements.findFirst({
    where: and(
      eq(schema.entitlements.userId, userId),
      eq(schema.entitlements.productId, productId),
      isNull(schema.entitlements.revokedAt),
    ),
  });
  if (!existing) {
    await db.insert(schema.entitlements).values({ userId, productId });
  }

  revalidatePath("/admin/customers");
  redirect(`/admin/customers?user=${userId}`);
}

export async function revokeEntitlementAction(formData: FormData) {
  const entitlementId = formData.get("entitlementId") as string;
  const userId = formData.get("userId") as string;

  await db
    .update(schema.entitlements)
    .set({ revokedAt: new Date() })
    .where(eq(schema.entitlements.id, entitlementId));

  revalidatePath("/admin/customers");
  redirect(`/admin/customers?user=${userId}`);
}

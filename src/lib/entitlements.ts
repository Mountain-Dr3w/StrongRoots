import { and, eq, isNull } from "drizzle-orm";

import { db, schema } from "@/db";

export async function hasEntitlement(userId: string, productId: string): Promise<boolean> {
  const row = await db.query.entitlements.findFirst({
    where: and(
      eq(schema.entitlements.userId, userId),
      eq(schema.entitlements.productId, productId),
      isNull(schema.entitlements.revokedAt),
    ),
  });
  return Boolean(row);
}

export async function hasAssetAccess(userId: string, assetId: string): Promise<boolean> {
  const asset = await db.query.contentAssets.findFirst({
    where: eq(schema.contentAssets.id, assetId),
  });
  if (!asset) return false;

  const plan = await db.query.plans.findFirst({
    where: eq(schema.plans.id, asset.planId),
  });
  if (!plan) return false;

  return hasEntitlement(userId, plan.productId);
}

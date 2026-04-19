import { describe, expect, it } from "vitest";

import { db, schema } from "@/db";

describe("schema: users", () => {
  it("inserts and selects a user with a role", async () => {
    const [inserted] = await db
      .insert(schema.users)
      .values({ email: "admin@example.com", role: "admin" })
      .returning();

    expect(inserted.email).toBe("admin@example.com");
    expect(inserted.role).toBe("admin");
  });
});

describe("schema: products + plans + consulting_offerings", () => {
  it("round-trips a plan product with its plan row", async () => {
    const [product] = await db
      .insert(schema.products)
      .values({
        slug: "12-week-strength",
        type: "plan",
        name: "12-Week Strength",
        description: "Foundational strength program.",
        priceCents: 14900,
        stripePriceId: "price_test_123",
        active: true,
      })
      .returning();

    const [plan] = await db
      .insert(schema.plans)
      .values({
        productId: product.id,
        fileBundleKey: "bundles/12-week-strength.zip",
        weeks: 12,
        level: "beginner",
      })
      .returning();

    expect(plan.productId).toBe(product.id);
    expect(product.priceCents).toBe(14900);
  });

  it("round-trips a consulting offering", async () => {
    const [product] = await db
      .insert(schema.products)
      .values({
        slug: "60min-coaching",
        type: "consulting",
        name: "60-Minute Coaching Call",
        priceCents: 20000,
        stripePriceId: "price_test_coaching",
        active: true,
      })
      .returning();

    const [offering] = await db
      .insert(schema.consultingOfferings)
      .values({
        productId: product.id,
        durationMinutes: 60,
        requiresIntake: true,
        requiresDeposit: true,
      })
      .returning();

    expect(offering.durationMinutes).toBe(60);
    expect(offering.requiresIntake).toBe(true);
  });
});

describe("schema: orders + entitlements", () => {
  it("records an order and grants an entitlement", async () => {
    const [user] = await db
      .insert(schema.users)
      .values({ email: "buyer@example.com" })
      .returning();

    const [product] = await db
      .insert(schema.products)
      .values({
        slug: "order-test-plan",
        type: "plan",
        name: "Order Test Plan",
        priceCents: 9900,
        stripePriceId: "price_order_test",
      })
      .returning();

    const [order] = await db
      .insert(schema.orders)
      .values({
        userId: user.id,
        productId: product.id,
        stripeSessionId: "cs_test_abc",
        amountCents: 9900,
        status: "paid",
      })
      .returning();

    const [ent] = await db
      .insert(schema.entitlements)
      .values({ userId: user.id, productId: product.id })
      .returning();

    expect(order.status).toBe("paid");
    expect(ent.userId).toBe(user.id);
    expect(ent.revokedAt).toBeNull();
  });
});

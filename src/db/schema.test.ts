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

describe("schema: scheduling", () => {
  it("round-trips an availability rule and a booking with intake", async () => {
    await db.insert(schema.availabilityRules).values({
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "17:00",
      timezone: "America/New_York",
    });

    const [user] = await db
      .insert(schema.users)
      .values({ email: "booker@example.com" })
      .returning();

    const [product] = await db
      .insert(schema.products)
      .values({
        slug: "sched-test",
        type: "consulting",
        name: "Sched Test",
        priceCents: 10000,
        stripePriceId: "price_sched_test",
      })
      .returning();

    const [offering] = await db
      .insert(schema.consultingOfferings)
      .values({ productId: product.id, durationMinutes: 60 })
      .returning();

    const [booking] = await db
      .insert(schema.bookings)
      .values({
        userId: user.id,
        offeringId: offering.id,
        startAt: new Date("2026-06-01T13:00:00Z"),
        endAt: new Date("2026-06-01T14:00:00Z"),
        status: "confirmed",
      })
      .returning();

    const [intake] = await db
      .insert(schema.intakeForms)
      .values({
        bookingId: booking.id,
        answers: { goals: "build strength", injuries: "none" },
        submittedAt: new Date(),
      })
      .returning();

    expect(booking.status).toBe("confirmed");
    expect(intake.answers).toMatchObject({ goals: "build strength" });
  });
});

describe("schema: content + email", () => {
  it("round-trips a content asset for a plan", async () => {
    const [product] = await db
      .insert(schema.products)
      .values({
        slug: "content-test",
        type: "plan",
        name: "Content Test",
        priceCents: 5000,
        stripePriceId: "price_content_test",
      })
      .returning();

    const [plan] = await db
      .insert(schema.plans)
      .values({ productId: product.id, weeks: 8, level: "intermediate" })
      .returning();

    const [asset] = await db
      .insert(schema.contentAssets)
      .values({
        planId: plan.id,
        storageKey: "plans/content-test/week-1.pdf",
        mime: "application/pdf",
        displayName: "Week 1 Overview",
        order: 0,
      })
      .returning();

    expect(asset.planId).toBe(plan.id);
    expect(asset.order).toBe(0);
  });

  it("records an email log entry", async () => {
    const [log] = await db
      .insert(schema.emailLog)
      .values({
        to: "user@example.com",
        template: "receipt",
        stripeEventId: "evt_test_receipt_1",
      })
      .returning();

    expect(log.template).toBe("receipt");
    expect(log.sentAt).toBeInstanceOf(Date);
  });
});

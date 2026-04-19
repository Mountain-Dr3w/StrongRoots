import { beforeAll, describe, expect, it } from "vitest";
import { eq, sql } from "drizzle-orm";

import { db, schema } from "@/db";
import { seed } from "@/db/seed";

describe("seed", () => {
  beforeAll(async () => {
    await db.execute(sql`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
    const { execSync } = await import("node:child_process");
    execSync("npx drizzle-kit push", {
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL_TEST },
      stdio: "inherit",
    });
  });

  it("creates exactly one admin user and one active plan product", async () => {
    await seed();

    const admins = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.role, "admin"));
    expect(admins).toHaveLength(1);
    expect(admins[0].email).toBe("ashlyn@strongroots.local");

    const planProducts = await db
      .select()
      .from(schema.products)
      .where(eq(schema.products.type, "plan"));
    expect(planProducts).toHaveLength(1);
    expect(planProducts[0].active).toBe(true);

    const plans = await db.select().from(schema.plans);
    expect(plans).toHaveLength(1);
    expect(plans[0].productId).toBe(planProducts[0].id);
  });

  it("is idempotent: a second run does not create duplicates", async () => {
    await seed();

    const admins = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.role, "admin"));
    expect(admins).toHaveLength(1);

    const products = await db.select().from(schema.products);
    expect(products).toHaveLength(1);
  });
});

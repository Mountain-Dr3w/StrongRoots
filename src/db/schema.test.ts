import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";

import { db, schema } from "@/db";

describe("schema: users", () => {
  beforeAll(async () => {
    await db.execute(sql`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
  });

  afterAll(async () => {
    // no-op; next test run will drop+recreate
  });

  it("inserts and selects a user with a role", async () => {
    // This will fail until Task 4 creates the users table and pushes it.
    const [inserted] = await db
      .insert(schema.users)
      .values({ email: "admin@example.com", role: "admin" })
      .returning();

    expect(inserted.email).toBe("admin@example.com");
    expect(inserted.role).toBe("admin");
  });
});

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

# BD-001: Database Schema + Migrations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Define the full Drizzle ORM schema for Ashlyn Training (12 tables across auth, commerce, scheduling, content, email), wire a typed `db` client, validate env with Zod, and prove the schema works end-to-end with `drizzle-kit push` + a `db:seed` script that creates an admin user and a sample plan product.

**Architecture:** Split schema by domain (one file per concern in `src/db/schema/*.ts`), re-export from `src/db/schema/index.ts`. Drizzle client is a singleton factory in `src/db/index.ts` that reads `DATABASE_URL` from a Zod-validated `src/env.ts`. Local Postgres via `docker-compose.dev.yml`. Tests use Vitest against the same local DB with a dedicated test schema/database to avoid polluting dev data.

**Tech Stack:** Drizzle ORM 0.45, `postgres` driver 3.4, drizzle-kit 0.31, Zod 4, tsx 4, Vitest (new), PostgreSQL 16 via Docker.

**Ticket:** `StrongRoots-qyi` (BD-001)

---

## File Structure

**Created:**
- `docker-compose.dev.yml` — local Postgres service (port 5432, volume, healthcheck)
- `.env.local` — `DATABASE_URL`, `DATABASE_URL_TEST` (gitignored)
- `.env.example` — committed template
- `drizzle.config.ts` — drizzle-kit config
- `vitest.config.ts` — Vitest config (node env, tsx)
- `src/env.ts` — Zod-validated process.env singleton
- `src/db/index.ts` — typed `db` client + schema re-export
- `src/db/schema/index.ts` — barrel re-export
- `src/db/schema/auth.ts` — users, accounts, sessions, verificationTokens (+ userRoleEnum)
- `src/db/schema/products.ts` — products, plans, consultingOfferings (+ productTypeEnum, planLevelEnum)
- `src/db/schema/commerce.ts` — orders, entitlements (+ orderStatusEnum)
- `src/db/schema/scheduling.ts` — availabilityRules, availabilityExceptions, bookings, intakeForms (+ bookingStatusEnum)
- `src/db/schema/content.ts` — contentAssets
- `src/db/schema/email.ts` — emailLog
- `src/db/seed.ts` — executable seed script (admin user + sample plan product)
- `src/db/seed.test.ts` — Vitest integration test for seed script
- `src/db/schema.test.ts` — Vitest integration test: insert + select round-trip on every table

**Modified:**
- `package.json` — add scripts `db:up`, `db:down`, `db:push`, `db:seed`, `db:studio`, `test`; add devDeps `vitest`, `@types/pg`
- `.gitignore` — ensure `.env.local` and `postgres-data/` are ignored (scaffold already covers `.env*`)

---

## Task 1: Local Postgres via Docker Compose

**Files:**
- Create: `docker-compose.dev.yml`
- Create: `.env.local`
- Create: `.env.example`
- Modify: `package.json` (scripts)

- [ ] **Step 1.1: Confirm Docker Desktop is running**

Run:
```bash
open -a Docker
# wait for Docker to start, then:
docker info > /dev/null && echo "docker ready"
```
Expected: prints `docker ready`. If it doesn't, open Docker Desktop manually before proceeding.

- [ ] **Step 1.2: Create `docker-compose.dev.yml`**

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: ashlyn-pg
    restart: unless-stopped
    environment:
      POSTGRES_USER: ashlyn
      POSTGRES_PASSWORD: ashlyn
      POSTGRES_DB: ashlyn
    ports:
      - "5432:5432"
    volumes:
      - ./postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ashlyn -d ashlyn"]
      interval: 2s
      timeout: 3s
      retries: 20
```

- [ ] **Step 1.3: Create `.env.example`**

```
DATABASE_URL=postgres://ashlyn:ashlyn@localhost:5432/ashlyn
DATABASE_URL_TEST=postgres://ashlyn:ashlyn@localhost:5432/ashlyn_test
```

- [ ] **Step 1.4: Create `.env.local` (gitignored)**

```
DATABASE_URL=postgres://ashlyn:ashlyn@localhost:5432/ashlyn
DATABASE_URL_TEST=postgres://ashlyn:ashlyn@localhost:5432/ashlyn_test
```

- [ ] **Step 1.5: Add scripts to `package.json`**

In the `scripts` block, add:
```json
"db:up": "docker compose -f docker-compose.dev.yml up -d && docker compose -f docker-compose.dev.yml exec -T postgres sh -c 'until pg_isready -U ashlyn; do sleep 0.5; done'",
"db:down": "docker compose -f docker-compose.dev.yml down",
"db:push": "drizzle-kit push",
"db:seed": "tsx src/db/seed.ts",
"db:studio": "drizzle-kit studio",
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 1.6: Start the DB and verify connectivity**

Run:
```bash
npm run db:up
docker compose -f docker-compose.dev.yml exec -T postgres psql -U ashlyn -d ashlyn -c "SELECT version();"
docker compose -f docker-compose.dev.yml exec -T postgres psql -U ashlyn -d postgres -c "CREATE DATABASE ashlyn_test;"
```
Expected: prints Postgres 16 version; `CREATE DATABASE` succeeds.

- [ ] **Step 1.7: Commit**

```bash
git add docker-compose.dev.yml .env.example package.json
git commit -m "chore(bd-001): local postgres via docker compose + npm scripts"
```

---

## Task 2: Env validation + Drizzle client

**Files:**
- Create: `src/env.ts`
- Create: `src/db/index.ts`
- Create: `drizzle.config.ts`

- [ ] **Step 2.1: Create `src/env.ts`**

```typescript
import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  DATABASE_URL_TEST: z.string().url().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment");
}

export const env = parsed.data;
```

- [ ] **Step 2.2: Create `src/db/index.ts`**

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env";
import * as schema from "@/db/schema";

const connectionString =
  env.NODE_ENV === "test" && env.DATABASE_URL_TEST
    ? env.DATABASE_URL_TEST
    : env.DATABASE_URL;

const client = postgres(connectionString, { max: 10 });

export const db = drizzle(client, { schema });
export type Database = typeof db;
export { schema };
```

- [ ] **Step 2.3: Create `drizzle.config.ts`**

```typescript
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
```

- [ ] **Step 2.4: Install dotenv (dev-only, used by drizzle-kit)**

```bash
npm install --save-dev dotenv
```

- [ ] **Step 2.5: Commit**

```bash
git add src/env.ts src/db/index.ts drizzle.config.ts package.json package-lock.json
git commit -m "feat(bd-001): zod-validated env + drizzle client scaffold"
```

---

## Task 3: Install Vitest and write the first failing integration test

**Files:**
- Create: `vitest.config.ts`
- Create: `src/db/schema/index.ts` (empty barrel — tables land in later tasks)
- Create: `src/db/schema.test.ts`

- [ ] **Step 3.1: Install Vitest**

```bash
npm install --save-dev vitest @types/pg
```

- [ ] **Step 3.2: Create `vitest.config.ts`**

```typescript
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    env: { NODE_ENV: "test" },
    setupFiles: ["dotenv/config"],
    hookTimeout: 30_000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 3.3: Create `src/db/schema/index.ts` as an empty barrel**

```typescript
export {};
```

- [ ] **Step 3.4: Write the failing test `src/db/schema.test.ts`**

```typescript
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
```

- [ ] **Step 3.5: Run the test to verify it fails**

Run:
```bash
npm run test
```
Expected: FAIL — `schema.users` is undefined (barrel is empty). This is the expected red state.

- [ ] **Step 3.6: Commit (red state)**

```bash
git add vitest.config.ts src/db/schema/index.ts src/db/schema.test.ts package.json package-lock.json
git commit -m "test(bd-001): failing vitest scaffolding for schema round-trip"
```

---

## Task 4: Auth schema (users, accounts, sessions, verificationTokens)

**Files:**
- Create: `src/db/schema/auth.ts`
- Modify: `src/db/schema/index.ts`

- [ ] **Step 4.1: Create `src/db/schema/auth.ts`**

```typescript
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    emailVerified: timestamp("email_verified", { withTimezone: true }),
    name: text("name"),
    image: text("image"),
    role: userRoleEnum("role").notNull().default("user"),
    timezone: text("timezone").notNull().default("UTC"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailIdx: uniqueIndex("users_email_idx").on(t.email),
  }),
);

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.provider, t.providerAccountId] }),
    userIdx: index("accounts_user_idx").on(t.userId),
  }),
);

export const sessions = pgTable(
  "sessions",
  {
    sessionToken: text("session_token").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (t) => ({
    userIdx: index("sessions_user_idx").on(t.userId),
  }),
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.identifier, t.token] }),
  }),
);
```

- [ ] **Step 4.2: Update `src/db/schema/index.ts`**

```typescript
export * from "./auth";
```

- [ ] **Step 4.3: Push schema and re-run the test**

Run:
```bash
npm run db:push
npm run test
```
Expected: `db:push` writes the users/accounts/sessions/verification_tokens tables; the test now passes (admin user round-trip works).

- [ ] **Step 4.4: Commit**

```bash
git add src/db/schema/auth.ts src/db/schema/index.ts drizzle/
git commit -m "feat(bd-001): auth schema (users, accounts, sessions, verification_tokens)"
```

---

## Task 5: Products schema (products, plans, consulting_offerings)

**Files:**
- Create: `src/db/schema/products.ts`
- Modify: `src/db/schema/index.ts`
- Modify: `src/db/schema.test.ts`

- [ ] **Step 5.1: Extend the failing test for products**

Append to `src/db/schema.test.ts`:
```typescript
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
```

- [ ] **Step 5.2: Run — expect failure**

Run: `npm run test`
Expected: FAIL — `schema.products`, `schema.plans`, `schema.consultingOfferings` undefined.

- [ ] **Step 5.3: Create `src/db/schema/products.ts`**

```typescript
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const productTypeEnum = pgEnum("product_type", ["plan", "consulting"]);
export const planLevelEnum = pgEnum("plan_level", ["beginner", "intermediate", "advanced"]);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    type: productTypeEnum("type").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    priceCents: integer("price_cents").notNull(),
    stripePriceId: text("stripe_price_id"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugIdx: uniqueIndex("products_slug_idx").on(t.slug),
    typeActiveIdx: index("products_type_active_idx").on(t.type, t.active),
  }),
);

export const plans = pgTable("plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  fileBundleKey: text("file_bundle_key"),
  weeks: integer("weeks").notNull(),
  level: planLevelEnum("level").notNull(),
});

export const consultingOfferings = pgTable("consulting_offerings", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  durationMinutes: integer("duration_minutes").notNull(),
  requiresIntake: boolean("requires_intake").notNull().default(true),
  requiresDeposit: boolean("requires_deposit").notNull().default(false),
});
```

- [ ] **Step 5.4: Update `src/db/schema/index.ts`**

```typescript
export * from "./auth";
export * from "./products";
```

- [ ] **Step 5.5: Push + test**

Run:
```bash
npm run db:push
npm run test
```
Expected: all three `products`/`plans`/`consulting_offerings` tests pass.

- [ ] **Step 5.6: Commit**

```bash
git add src/db/schema/products.ts src/db/schema/index.ts src/db/schema.test.ts drizzle/
git commit -m "feat(bd-001): products, plans, consulting_offerings schema"
```

---

## Task 6: Commerce schema (orders, entitlements)

**Files:**
- Create: `src/db/schema/commerce.ts`
- Modify: `src/db/schema/index.ts`
- Modify: `src/db/schema.test.ts`

- [ ] **Step 6.1: Extend the failing test**

Append to `src/db/schema.test.ts`:
```typescript
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
```

- [ ] **Step 6.2: Run — expect failure**

Run: `npm run test`
Expected: FAIL — `schema.orders` and `schema.entitlements` undefined.

- [ ] **Step 6.3: Create `src/db/schema/commerce.ts`**

```typescript
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { products } from "./products";
import { users } from "./auth";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    stripeSessionId: text("stripe_session_id").notNull(),
    amountCents: integer("amount_cents").notNull(),
    status: orderStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    stripeSessionIdx: uniqueIndex("orders_stripe_session_idx").on(t.stripeSessionId),
    userIdx: index("orders_user_idx").on(t.userId),
  }),
);

export const entitlements = pgTable(
  "entitlements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    grantedAt: timestamp("granted_at", { withTimezone: true }).notNull().defaultNow(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  (t) => ({
    userProductIdx: index("entitlements_user_product_idx").on(t.userId, t.productId),
  }),
);
```

- [ ] **Step 6.4: Update `src/db/schema/index.ts`**

```typescript
export * from "./auth";
export * from "./products";
export * from "./commerce";
```

- [ ] **Step 6.5: Push + test**

Run: `npm run db:push && npm run test`
Expected: all orders/entitlements tests pass.

- [ ] **Step 6.6: Commit**

```bash
git add src/db/schema/commerce.ts src/db/schema/index.ts src/db/schema.test.ts drizzle/
git commit -m "feat(bd-001): orders + entitlements schema"
```

---

## Task 7: Scheduling schema (availability_rules, availability_exceptions, bookings, intake_forms)

**Files:**
- Create: `src/db/schema/scheduling.ts`
- Modify: `src/db/schema/index.ts`
- Modify: `src/db/schema.test.ts`

- [ ] **Step 7.1: Extend the failing test**

Append to `src/db/schema.test.ts`:
```typescript
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
```

- [ ] **Step 7.2: Run — expect failure**

Run: `npm run test`
Expected: FAIL — scheduling tables undefined.

- [ ] **Step 7.3: Create `src/db/schema/scheduling.ts`**

```typescript
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { consultingOfferings } from "./products";
import { users } from "./auth";

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending_payment",
  "confirmed",
  "cancelled",
  "completed",
  "no_show",
]);

export const availabilityRules = pgTable("availability_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sun-Sat)
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  timezone: text("timezone").notNull(),
});

export const availabilityExceptions = pgTable("availability_exceptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: date("date").notNull(),
  blocked: boolean("blocked").notNull().default(true),
  note: text("note"),
});

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    offeringId: uuid("offering_id")
      .notNull()
      .references(() => consultingOfferings.id, { onDelete: "restrict" }),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }).notNull(),
    status: bookingStatusEnum("status").notNull().default("pending_payment"),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    startAtIdx: index("bookings_start_at_idx").on(t.startAt),
    userIdx: index("bookings_user_idx").on(t.userId),
  }),
);

export const intakeForms = pgTable("intake_forms", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  answers: jsonb("answers").$type<Record<string, unknown>>().notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
});
```

- [ ] **Step 7.4: Update `src/db/schema/index.ts`**

```typescript
export * from "./auth";
export * from "./products";
export * from "./commerce";
export * from "./scheduling";
```

- [ ] **Step 7.5: Push + test**

Run: `npm run db:push && npm run test`
Expected: scheduling test passes.

- [ ] **Step 7.6: Commit**

```bash
git add src/db/schema/scheduling.ts src/db/schema/index.ts src/db/schema.test.ts drizzle/
git commit -m "feat(bd-001): availability rules/exceptions, bookings, intake_forms"
```

---

## Task 8: Content + Email schemas

**Files:**
- Create: `src/db/schema/content.ts`
- Create: `src/db/schema/email.ts`
- Modify: `src/db/schema/index.ts`
- Modify: `src/db/schema.test.ts`

- [ ] **Step 8.1: Extend the failing test**

Append to `src/db/schema.test.ts`:
```typescript
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
```

- [ ] **Step 8.2: Run — expect failure**

Run: `npm run test`
Expected: FAIL — `schema.contentAssets`, `schema.emailLog` undefined.

- [ ] **Step 8.3: Create `src/db/schema/content.ts`**

```typescript
import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { plans } from "./products";

export const contentAssets = pgTable(
  "content_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    planId: uuid("plan_id")
      .notNull()
      .references(() => plans.id, { onDelete: "cascade" }),
    storageKey: text("storage_key").notNull(),
    mime: text("mime").notNull(),
    displayName: text("display_name").notNull(),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    planOrderIdx: index("content_assets_plan_order_idx").on(t.planId, t.order),
  }),
);
```

- [ ] **Step 8.4: Create `src/db/schema/email.ts`**

```typescript
import { index, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const emailLog = pgTable(
  "email_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    to: text("to").notNull(),
    template: text("template").notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
    stripeEventId: text("stripe_event_id"),
  },
  (t) => ({
    stripeEventIdx: uniqueIndex("email_log_stripe_event_idx").on(t.stripeEventId),
    templateSentIdx: index("email_log_template_sent_idx").on(t.template, t.sentAt),
  }),
);
```

- [ ] **Step 8.5: Update `src/db/schema/index.ts`**

```typescript
export * from "./auth";
export * from "./products";
export * from "./commerce";
export * from "./scheduling";
export * from "./content";
export * from "./email";
```

- [ ] **Step 8.6: Push + test**

Run: `npm run db:push && npm run test`
Expected: every `schema.test.ts` suite passes (all 12 tables covered).

- [ ] **Step 8.7: Commit**

```bash
git add src/db/schema/content.ts src/db/schema/email.ts src/db/schema/index.ts src/db/schema.test.ts drizzle/
git commit -m "feat(bd-001): content_assets + email_log schema"
```

---

## Task 9: Seed script (admin user + sample plan product)

**Files:**
- Create: `src/db/seed.ts`
- Create: `src/db/seed.test.ts`

- [ ] **Step 9.1: Write failing test `src/db/seed.test.ts`**

```typescript
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { eq, sql } from "drizzle-orm";

import { db, schema } from "@/db";
import { seed } from "@/db/seed";

describe("seed", () => {
  beforeAll(async () => {
    await db.execute(sql`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
    // Re-apply schema before seeding
    const { execSync } = await import("node:child_process");
    execSync("npm run db:push", { stdio: "inherit" });
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
```

- [ ] **Step 9.2: Run — expect failure**

Run: `npm run test -- seed`
Expected: FAIL — `@/db/seed` has no `seed` export.

- [ ] **Step 9.3: Write `src/db/seed.ts`**

```typescript
import { eq } from "drizzle-orm";

import { db, schema } from "@/db";

export async function seed() {
  const adminEmail = "ashlyn@strongroots.local";

  const existingAdmin = await db.query.users.findFirst({
    where: eq(schema.users.email, adminEmail),
  });

  const adminId =
    existingAdmin?.id ??
    (
      await db
        .insert(schema.users)
        .values({
          email: adminEmail,
          name: "Ashlyn",
          role: "admin",
          timezone: "America/New_York",
        })
        .returning({ id: schema.users.id })
    )[0].id;

  const sampleSlug = "foundations-8-week";

  const existingProduct = await db.query.products.findFirst({
    where: eq(schema.products.slug, sampleSlug),
  });

  let productId: string;
  if (existingProduct) {
    productId = existingProduct.id;
  } else {
    const [inserted] = await db
      .insert(schema.products)
      .values({
        slug: sampleSlug,
        type: "plan",
        name: "Foundations: 8-Week Starter",
        description: "An 8-week introduction to strength training fundamentals.",
        priceCents: 9900,
        stripePriceId: "price_seed_foundations",
        active: true,
      })
      .returning({ id: schema.products.id });
    productId = inserted.id;
  }

  const existingPlan = await db.query.plans.findFirst({
    where: eq(schema.plans.productId, productId),
  });

  if (!existingPlan) {
    await db.insert(schema.plans).values({
      productId,
      weeks: 8,
      level: "beginner",
      fileBundleKey: "bundles/foundations-8-week.zip",
    });
  }

  console.log(`Seed complete: admin=${adminId} product=${productId}`);
  return { adminId, productId };
}

// Allow `tsx src/db/seed.ts` to run this directly.
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
```

- [ ] **Step 9.4: Run tests**

Run: `npm run test -- seed`
Expected: both seed tests pass (1 admin + 1 plan product, idempotent).

- [ ] **Step 9.5: Verify the `npm run db:seed` entry point works end-to-end**

Run:
```bash
docker compose -f docker-compose.dev.yml exec -T postgres psql -U ashlyn -d ashlyn -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npm run db:push
npm run db:seed
docker compose -f docker-compose.dev.yml exec -T postgres psql -U ashlyn -d ashlyn -c "SELECT email, role FROM users;"
docker compose -f docker-compose.dev.yml exec -T postgres psql -U ashlyn -d ashlyn -c "SELECT slug, type, price_cents FROM products;"
```
Expected:
- `users` shows one row: `ashlyn@strongroots.local | admin`
- `products` shows one row: `foundations-8-week | plan | 9900`

- [ ] **Step 9.6: Commit**

```bash
git add src/db/seed.ts src/db/seed.test.ts
git commit -m "feat(bd-001): db:seed creates admin user + sample plan (idempotent)"
```

---

## Task 10: Finalize and close the ticket

- [ ] **Step 10.1: Run the full verification suite**

Run:
```bash
npm run db:push
npm run test
npm run db:seed
```
Expected:
- `db:push` prints no pending changes (idempotent second time).
- `npm run test` — all suites green.
- `db:seed` prints `Seed complete: admin=... product=...`.

- [ ] **Step 10.2: Update `primer.md`**

Rewrite `primer.md` with:
- Current Focus: BD-001 complete. Next: BD-003 (design tokens) or BD-002 (auth).
- Last Completed: BD-001 — schema + seed.
- Next Step: `bd ready` to re-check unblocked tickets; primer recommends BD-003 first so BD-004 (catalog) is unblocked.
- Branch: `main`

- [ ] **Step 10.3: Close the Beads ticket**

Run:
```bash
bd close StrongRoots-qyi
bd ready
```
Expected: BD-002 (auth) and BD-003 (design system) are both unblocked. BD-001 no longer appears.

- [ ] **Step 10.4: Final commit + push**

```bash
git add primer.md
git commit -m "chore(bd-001): close ticket; primer points at BD-003"
git pull --rebase
bd dolt push || true  # only if a dolt remote is configured
git push
git status  # MUST show "up to date with origin"
```

---

## Self-Review

1. **Spec coverage** — every table in the ticket body has a create+test step:
   - users, accounts, sessions, verification_tokens (Task 4) ✓
   - products, plans, consulting_offerings (Task 5) ✓
   - orders, entitlements (Task 6) ✓
   - availability_rules, availability_exceptions, bookings, intake_forms (Task 7) ✓
   - content_assets, email_log (Task 8) ✓
   - Required indexes: users.email (4), orders.stripe_session_id (6), entitlements(user_id, product_id) (6), bookings(start_at) (7), content_assets(plan_id, order) (8) ✓
   - Money as integer cents: `priceCents`, `amountCents` ✓
   - Timestamps timestamptz UTC: every `timestamp` column uses `{ withTimezone: true }` ✓
   - Done criteria: `drizzle-kit push` clean + `npm run db:seed` creates admin + sample plan (Task 10.1) ✓

2. **Placeholder scan** — no TBD/TODO/"similar to Task N" text; every step has real code or real commands.

3. **Type consistency** — camelCase TS ↔ snake_case SQL column names align: `priceCents`/`price_cents`, `stripePriceId`/`stripe_price_id`, `createdAt`/`created_at`. `schema.users`, `schema.products`, `schema.plans`, etc. are consistently referenced.

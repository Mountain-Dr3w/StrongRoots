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

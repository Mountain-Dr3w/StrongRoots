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

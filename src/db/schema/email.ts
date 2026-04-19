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

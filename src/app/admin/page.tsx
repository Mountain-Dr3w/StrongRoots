import { and, eq, gte, isNull, sql } from "drizzle-orm";

import { db, schema } from "@/db";
import { Card, CardBody, CardTitle } from "@/components/Card";

export const dynamic = "force-dynamic";

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function AdminDashboard() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [activeEnt] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.entitlements)
    .where(isNull(schema.entitlements.revokedAt));

  const [upcoming] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.bookings)
    .where(
      and(gte(schema.bookings.startAt, now), eq(schema.bookings.status, "confirmed")),
    );

  const [revenue] = await db
    .select({ sum: sql<number>`coalesce(sum(${schema.orders.amountCents}), 0)::int` })
    .from(schema.orders)
    .where(
      and(
        eq(schema.orders.status, "paid"),
        gte(schema.orders.createdAt, monthStart),
      ),
    );

  return (
    <main className="max-w-6xl mx-auto p-[var(--space-6)] flex flex-col gap-[var(--space-6)]">
      <h1 className="font-[var(--sr-font-display)] text-[44px] leading-[var(--sr-lh-tight)] tracking-[-0.02em]">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[var(--space-4)]">
        <Card>
          <CardTitle>{activeEnt.count}</CardTitle>
          <CardBody className="text-[var(--sr-ink-muted)]">Active entitlements</CardBody>
        </Card>
        <Card>
          <CardTitle>{upcoming.count}</CardTitle>
          <CardBody className="text-[var(--sr-ink-muted)]">Upcoming bookings</CardBody>
        </Card>
        <Card>
          <CardTitle>{formatPrice(revenue.sum)}</CardTitle>
          <CardBody className="text-[var(--sr-ink-muted)]">Revenue this month</CardBody>
        </Card>
      </div>
    </main>
  );
}

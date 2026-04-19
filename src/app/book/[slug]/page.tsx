import { notFound } from "next/navigation";
import { addDays, startOfDay } from "date-fns";
import { and, eq, gte, lte } from "drizzle-orm";

import { auth } from "@/auth";
import { db, schema } from "@/db";
import { Card, CardBody, CardTitle } from "@/components/Card";
import { computeOpenSlots } from "@/lib/availability";
import { BookingForm } from "./BookingForm";

type PageParams = Promise<{ slug: string }>;

export const dynamic = "force-dynamic";

export default async function BookPage({ params }: { params: PageParams }) {
  const { slug } = await params;

  const session = await auth();

  const product = await db.query.products.findFirst({
    where: and(eq(schema.products.slug, slug), eq(schema.products.active, true)),
  });
  if (!product || product.type !== "consulting") notFound();

  const offering = await db.query.consultingOfferings.findFirst({
    where: eq(schema.consultingOfferings.productId, product.id),
  });
  if (!offering) notFound();

  const windowFrom = startOfDay(new Date());
  const windowTo = addDays(windowFrom, 7);

  const rules = await db.select().from(schema.availabilityRules);
  const exceptions = await db
    .select()
    .from(schema.availabilityExceptions)
    .where(
      and(
        gte(schema.availabilityExceptions.date, windowFrom.toISOString().slice(0, 10)),
        lte(schema.availabilityExceptions.date, windowTo.toISOString().slice(0, 10)),
      ),
    );
  const existing = await db
    .select({
      startAt: schema.bookings.startAt,
      endAt: schema.bookings.endAt,
      status: schema.bookings.status,
    })
    .from(schema.bookings)
    .where(
      and(
        eq(schema.bookings.offeringId, offering.id),
        gte(schema.bookings.startAt, windowFrom),
        lte(schema.bookings.startAt, windowTo),
      ),
    );

  const slots = computeOpenSlots({
    from: windowFrom,
    to: windowTo,
    durationMinutes: offering.durationMinutes,
    rules: rules.map((r) => ({
      dayOfWeek: r.dayOfWeek,
      startTime: r.startTime,
      endTime: r.endTime,
      timezone: r.timezone,
    })),
    exceptions: exceptions.map((e) => ({ date: e.date, blocked: e.blocked })),
    bookings: existing,
  });

  return (
    <main className="min-h-screen p-[var(--space-8)]">
      <div className="max-w-2xl mx-auto flex flex-col gap-[var(--space-6)]">
        <div className="text-[var(--font-size-xs)] uppercase tracking-wide text-[var(--color-muted)]">
          Book a session
        </div>
        <h1 className="text-[var(--font-size-2xl)] font-semibold">{product.name}</h1>
        <p className="text-[var(--color-muted)]">
          {offering.durationMinutes} minutes
          {offering.requiresDeposit ? " · deposit required" : ""}
        </p>

        {!session ? (
          <Card>
            <CardTitle>Sign in to book</CardTitle>
            <CardBody>
              You need an account to book. <a href="/signin" className="underline">Sign in</a>.
            </CardBody>
          </Card>
        ) : slots.length === 0 ? (
          <Card>
            <CardTitle>No open slots in the next 7 days</CardTitle>
            <CardBody>
              Check back soon. Ashlyn opens new times weekly.
            </CardBody>
          </Card>
        ) : (
          <BookingForm
            offeringId={offering.id}
            requiresIntake={offering.requiresIntake}
            slots={slots.map((s) => s.toISOString())}
          />
        )}
      </div>
    </main>
  );
}

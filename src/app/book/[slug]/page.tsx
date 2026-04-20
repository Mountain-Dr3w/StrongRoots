import Link from "next/link";
import { notFound } from "next/navigation";
import { addDays, startOfDay } from "date-fns";
import { and, eq, gte, lte } from "drizzle-orm";

import { auth } from "@/auth";
import { db, schema } from "@/db";
import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/site/Eyebrow";
import { SiteShell } from "@/components/site/SiteShell";
import { StripedPlaceholder } from "@/components/site/StripedPlaceholder";
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
    <SiteShell>
      <section className="px-6 md:px-10 pt-10 md:pt-16 pb-24 md:pb-32">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[0.9fr_1.1fr] gap-10 md:gap-16 items-start">
          {/* Session summary */}
          <aside className="md:sticky md:top-28 flex flex-col gap-6">
            <StripedPlaceholder
              label={`${product.slug} · intake`}
              src="/stock/trainer.jpg"
              aspect="4/5"
              priority
            />
            <div className="flex flex-col gap-3">
              <Eyebrow>Book a session</Eyebrow>
              <h1 className="font-[var(--sr-font-display)] font-normal text-[var(--sr-ink)] text-[40px] md:text-[48px] leading-[var(--sr-lh-tight)] tracking-[-0.02em]">
                {product.name}
              </h1>
              <div className="flex flex-wrap gap-x-6 gap-y-2 font-[var(--sr-font-mono)] text-[13px] text-[var(--sr-ink-soft)]">
                <span>{offering.durationMinutes} min</span>
                {offering.requiresDeposit ? <span>· deposit required</span> : null}
                {offering.requiresIntake ? <span>· intake form</span> : null}
              </div>
            </div>
          </aside>

          {/* Slot picker */}
          <div className="flex flex-col gap-6">
            {!session ? (
              <div className="border border-[var(--sr-line-soft)] bg-[var(--sr-surface)] rounded-[var(--sr-radius-md)] p-8 flex flex-col gap-4">
                <Eyebrow>Sign in required</Eyebrow>
                <h2 className="font-[var(--sr-font-display)] text-[28px] leading-[var(--sr-lh-snug)] text-[var(--sr-ink)]">
                  Create an account to book.
                </h2>
                <p className="text-[var(--sr-ink-soft)]">
                  Ashlyn needs your email to send confirmation and reminders.
                </p>
                <Link href="/signin" className="self-start">
                  <Button variant="primary">Sign in</Button>
                </Link>
              </div>
            ) : slots.length === 0 ? (
              <div className="border border-[var(--sr-line-soft)] bg-[var(--sr-surface)] rounded-[var(--sr-radius-md)] p-8 flex flex-col gap-3">
                <Eyebrow>No open slots</Eyebrow>
                <h2 className="font-[var(--sr-font-display)] text-[28px] leading-[var(--sr-lh-snug)] text-[var(--sr-ink)]">
                  Check back soon.
                </h2>
                <p className="text-[var(--sr-ink-soft)]">
                  Ashlyn opens new times weekly. You can also{" "}
                  <Link
                    href="/contact"
                    className="underline decoration-[var(--sr-line)] underline-offset-4 hover:text-[var(--sr-ink)]"
                  >
                    email to join the waitlist
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <BookingForm
                offeringId={offering.id}
                requiresIntake={offering.requiresIntake}
                slots={slots.map((s) => s.toISOString())}
              />
            )}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

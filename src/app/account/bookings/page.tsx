import { asc, eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db, schema } from "@/db";
import { Button } from "@/components/Button";
import { Card, CardBody } from "@/components/Card";
import { Eyebrow } from "@/components/site/Eyebrow";
import { canCancel } from "@/lib/availability";
import { cancelBookingAction } from "@/app/book/[slug]/actions";

export const dynamic = "force-dynamic";

function formatDate(d: Date): string {
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function BookingsTab() {
  const session = await auth();
  if (!session) return null;

  const rows = await db
    .select({
      id: schema.bookings.id,
      startAt: schema.bookings.startAt,
      endAt: schema.bookings.endAt,
      status: schema.bookings.status,
      productName: schema.products.name,
    })
    .from(schema.bookings)
    .innerJoin(
      schema.consultingOfferings,
      eq(schema.consultingOfferings.id, schema.bookings.offeringId),
    )
    .innerJoin(schema.products, eq(schema.products.id, schema.consultingOfferings.productId))
    .where(eq(schema.bookings.userId, session.user.id))
    .orderBy(asc(schema.bookings.startAt));

  const now = new Date();
  const upcoming = rows.filter((r) => r.startAt >= now && r.status !== "cancelled");
  const past = rows.filter((r) => r.startAt < now || r.status === "cancelled");

  return (
    <main className="max-w-4xl mx-auto px-6 md:px-10 py-12 md:py-16 flex flex-col gap-12">
      <header className="flex flex-col gap-3">
        <Eyebrow>Sessions</Eyebrow>
        <h1 className="font-[var(--sr-font-display)] font-normal text-[var(--sr-ink)] text-[48px] md:text-[56px] leading-[var(--sr-lh-tight)] tracking-[-0.02em]">
          Bookings.
        </h1>
      </header>

      <section className="flex flex-col gap-5">
        <div className="flex items-baseline justify-between border-b border-[var(--sr-line-soft)] pb-3">
          <h2 className="font-[var(--sr-font-display)] text-[28px] text-[var(--sr-ink)]">
            Upcoming
          </h2>
          <span className="font-[var(--sr-font-mono)] text-[11px] text-[var(--sr-ink-muted)]">
            {upcoming.length} scheduled
          </span>
        </div>
        {upcoming.length === 0 ? (
          <Card>
            <CardBody>
              <p className="text-[var(--sr-ink-soft)]">No upcoming bookings.</p>
            </CardBody>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {upcoming.map((b) => (
              <Card key={b.id}>
                <CardBody className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                  <div className="flex flex-col gap-2">
                    <Eyebrow>{b.status.replace("_", " ")}</Eyebrow>
                    <div className="font-[var(--sr-font-display)] text-[24px] text-[var(--sr-ink)]">
                      {b.productName}
                    </div>
                    <div className="font-[var(--sr-font-mono)] text-[13px] text-[var(--sr-ink-soft)]">
                      {formatDate(b.startAt)}
                    </div>
                  </div>
                  <form action={cancelBookingAction}>
                    <input type="hidden" name="bookingId" value={b.id} />
                    <Button type="submit" variant="secondary" size="sm" arrow={false}>
                      {canCancel(b.startAt) ? "Cancel" : "Request cancellation"}
                    </Button>
                  </form>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-5">
        <div className="flex items-baseline justify-between border-b border-[var(--sr-line-soft)] pb-3">
          <h2 className="font-[var(--sr-font-display)] text-[28px] text-[var(--sr-ink)]">
            Past &amp; cancelled
          </h2>
          <span className="font-[var(--sr-font-mono)] text-[11px] text-[var(--sr-ink-muted)]">
            {past.length} total
          </span>
        </div>
        {past.length === 0 ? (
          <Card>
            <CardBody>
              <p className="text-[var(--sr-ink-soft)]">No past bookings.</p>
            </CardBody>
          </Card>
        ) : (
          <div className="flex flex-col divide-y divide-[var(--sr-line-soft)] border border-[var(--sr-line-soft)] rounded-[var(--sr-radius-md)] bg-[var(--sr-surface)]">
            {past.map((b) => (
              <div
                key={b.id}
                className="flex flex-wrap items-baseline justify-between gap-3 px-6 py-4"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-[var(--sr-font-display)] text-[18px] text-[var(--sr-ink)]">
                    {b.productName}
                  </span>
                  <span className="font-[var(--sr-font-mono)] text-[12px] text-[var(--sr-ink-soft)]">
                    {formatDate(b.startAt)}
                  </span>
                </div>
                <span className="font-[var(--sr-font-label)] text-[10px] uppercase tracking-[var(--sr-label-tracking)] text-[var(--sr-ink-muted)]">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

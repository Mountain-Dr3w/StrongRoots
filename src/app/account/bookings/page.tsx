import { asc, eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db, schema } from "@/db";
import { Button } from "@/components/Button";
import { Card, CardBody, CardTitle } from "@/components/Card";
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
    <main className="max-w-3xl mx-auto p-[var(--space-6)] flex flex-col gap-[var(--space-6)]">
      <h1 className="text-[var(--font-size-2xl)] font-semibold">Bookings</h1>

      <section>
        <h2 className="text-[var(--font-size-lg)] font-medium mb-[var(--space-3)]">Upcoming</h2>
        {upcoming.length === 0 ? (
          <Card>
            <CardBody>No upcoming bookings.</CardBody>
          </Card>
        ) : (
          <div className="flex flex-col gap-[var(--space-3)]">
            {upcoming.map((b) => (
              <Card key={b.id}>
                <CardTitle>{b.productName}</CardTitle>
                <CardBody className="flex flex-col gap-[var(--space-2)]">
                  <div>{formatDate(b.startAt)}</div>
                  <div className="text-[var(--color-muted)] text-[var(--font-size-sm)]">
                    Status: {b.status.replace("_", " ")}
                  </div>
                  <form action={cancelBookingAction} className="mt-[var(--space-2)]">
                    <input type="hidden" name="bookingId" value={b.id} />
                    <Button type="submit" variant="ghost" size="sm">
                      {canCancel(b.startAt) ? "Cancel" : "Request cancellation (late)"}
                    </Button>
                  </form>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-[var(--font-size-lg)] font-medium mb-[var(--space-3)]">Past & cancelled</h2>
        {past.length === 0 ? (
          <Card>
            <CardBody>No past bookings.</CardBody>
          </Card>
        ) : (
          <div className="flex flex-col gap-[var(--space-3)]">
            {past.map((b) => (
              <Card key={b.id}>
                <CardBody className="flex items-baseline justify-between flex-wrap gap-[var(--space-2)]">
                  <div>
                    <div className="font-medium">{b.productName}</div>
                    <div className="text-[var(--color-muted)] text-[var(--font-size-sm)]">
                      {formatDate(b.startAt)}
                    </div>
                  </div>
                  <div className="text-[var(--color-muted)] text-[var(--font-size-sm)]">
                    {b.status}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

import { asc, eq } from "drizzle-orm";

import { db, schema } from "@/db";
import { Card, CardBody, CardTitle } from "@/components/Card";

export const dynamic = "force-dynamic";

function formatDate(d: Date): string {
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default async function AdminBookings() {
  const rows = await db
    .select({
      id: schema.bookings.id,
      startAt: schema.bookings.startAt,
      status: schema.bookings.status,
      userEmail: schema.users.email,
      productName: schema.products.name,
      intakeAnswers: schema.intakeForms.answers,
    })
    .from(schema.bookings)
    .innerJoin(schema.users, eq(schema.users.id, schema.bookings.userId))
    .innerJoin(
      schema.consultingOfferings,
      eq(schema.consultingOfferings.id, schema.bookings.offeringId),
    )
    .innerJoin(schema.products, eq(schema.products.id, schema.consultingOfferings.productId))
    .leftJoin(schema.intakeForms, eq(schema.intakeForms.bookingId, schema.bookings.id))
    .orderBy(asc(schema.bookings.startAt));

  return (
    <main className="max-w-6xl mx-auto p-[var(--space-6)] flex flex-col gap-[var(--space-6)]">
      <h1 className="text-[var(--font-size-2xl)] font-semibold">Bookings</h1>

      {rows.length === 0 ? (
        <Card>
          <CardBody>No bookings yet.</CardBody>
        </Card>
      ) : (
        <div className="flex flex-col gap-[var(--space-3)]">
          {rows.map((b) => (
            <Card key={b.id}>
              <CardTitle>{b.productName}</CardTitle>
              <CardBody className="flex flex-col gap-[var(--space-2)]">
                <div className="flex items-baseline justify-between gap-[var(--space-3)] flex-wrap">
                  <div>{formatDate(b.startAt)}</div>
                  <div className="text-[var(--color-muted)] text-[var(--font-size-sm)]">
                    {b.userEmail} · {b.status.replace("_", " ")}
                  </div>
                </div>
                {b.intakeAnswers ? (
                  <details>
                    <summary className="cursor-pointer text-[var(--color-muted)] text-[var(--font-size-sm)]">
                      Intake
                    </summary>
                    <pre className="mt-[var(--space-2)] text-[var(--font-size-xs)] overflow-auto">
                      {JSON.stringify(b.intakeAnswers, null, 2)}
                    </pre>
                  </details>
                ) : null}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

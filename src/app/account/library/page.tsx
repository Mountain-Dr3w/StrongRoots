import Link from "next/link";
import { and, asc, eq, inArray, isNull } from "drizzle-orm";

import { auth } from "@/auth";
import { db, schema } from "@/db";
import { Card, CardBody, CardTitle } from "@/components/Card";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const session = await auth();
  if (!session) return null;

  const rows = await db
    .select({
      productId: schema.entitlements.productId,
      productName: schema.products.name,
      productSlug: schema.products.slug,
      productType: schema.products.type,
    })
    .from(schema.entitlements)
    .innerJoin(schema.products, eq(schema.products.id, schema.entitlements.productId))
    .where(
      and(
        eq(schema.entitlements.userId, session.user.id),
        isNull(schema.entitlements.revokedAt),
      ),
    );

  const productIds = rows.map((r) => r.productId);
  const planRows = productIds.length
    ? await db
        .select({
          id: schema.plans.id,
          productId: schema.plans.productId,
        })
        .from(schema.plans)
        .where(inArray(schema.plans.productId, productIds))
    : [];

  const planIds = planRows.map((p) => p.id);
  const assetRows = planIds.length
    ? await db
        .select()
        .from(schema.contentAssets)
        .where(inArray(schema.contentAssets.planId, planIds))
        .orderBy(asc(schema.contentAssets.order))
    : [];

  const assetsByPlan = new Map<string, typeof assetRows>();
  for (const a of assetRows) {
    const list = assetsByPlan.get(a.planId) ?? [];
    list.push(a);
    assetsByPlan.set(a.planId, list);
  }

  const planByProduct = new Map<string, (typeof planRows)[number]>();
  for (const p of planRows) planByProduct.set(p.productId, p);

  return (
    <main className="min-h-screen p-[var(--space-8)]">
      <div className="max-w-3xl mx-auto flex flex-col gap-[var(--space-6)]">
        <h1 className="text-[var(--font-size-2xl)] font-semibold">Your library</h1>

        {rows.length === 0 ? (
          <Card>
            <CardBody>
              You haven't purchased any plans yet. <Link href="/shop" className="underline">Browse the shop</Link>.
            </CardBody>
          </Card>
        ) : (
          rows.map((r) => {
            const plan = planByProduct.get(r.productId);
            const assets = plan ? (assetsByPlan.get(plan.id) ?? []) : [];
            return (
              <Card key={r.productId}>
                <CardTitle>{r.productName}</CardTitle>
                <CardBody>
                  {r.productType === "consulting" ? (
                    <p className="text-[var(--color-muted)]">
                      Consulting session — manage from the <Link href="/account" className="underline">Bookings</Link> tab.
                    </p>
                  ) : assets.length === 0 ? (
                    <p className="text-[var(--color-muted)]">No content available yet.</p>
                  ) : (
                    <ul className="flex flex-col gap-[var(--space-2)]">
                      {assets.map((a) => (
                        <li key={a.id}>
                          <a
                            href={`/api/content/${a.id}`}
                            className="underline text-[var(--color-accent)]"
                          >
                            {a.displayName}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardBody>
              </Card>
            );
          })
        )}
      </div>
    </main>
  );
}

import Link from "next/link";
import { and, asc, eq, inArray, isNull } from "drizzle-orm";

import { auth } from "@/auth";
import { db, schema } from "@/db";
import { Card, CardBody, CardTitle } from "@/components/Card";
import { Eyebrow } from "@/components/site/Eyebrow";

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
    <main className="max-w-4xl mx-auto px-6 md:px-10 py-12 md:py-16 flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <Eyebrow>Your practice</Eyebrow>
        <h1 className="font-[var(--sr-font-display)] font-normal text-[var(--sr-ink)] text-[48px] md:text-[56px] leading-[var(--sr-lh-tight)] tracking-[-0.02em]">
          Library.
        </h1>
        <p className="text-[var(--sr-ink-soft)] text-[17px] leading-[var(--sr-lh-normal)] max-w-xl">
          Everything you've purchased. Plans, content bundles, and session receipts.
        </p>
      </header>

      {rows.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-[var(--sr-ink-soft)]">
              You haven't purchased any plans yet.{" "}
              <Link
                href="/shop"
                className="underline decoration-[var(--sr-line)] underline-offset-4 hover:text-[var(--sr-ink)]"
              >
                Browse the shop
              </Link>
              .
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {rows.map((r) => {
            const plan = planByProduct.get(r.productId);
            const assets = plan ? (assetsByPlan.get(plan.id) ?? []) : [];
            return (
              <Card key={r.productId}>
                <CardBody className="flex flex-col gap-4">
                  <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    <Eyebrow>
                      {r.productType === "consulting" ? "Consulting" : "Plan"}
                    </Eyebrow>
                    <Link
                      href={`/shop/${r.productSlug}`}
                      className="font-[var(--sr-font-label)] text-[11px] uppercase tracking-[var(--sr-label-tracking)] text-[var(--sr-ink-soft)] hover:text-[var(--sr-ink)]"
                    >
                      View details →
                    </Link>
                  </div>
                  <CardTitle className="mb-0">{r.productName}</CardTitle>
                  {r.productType === "consulting" ? (
                    <p className="text-[var(--sr-ink-soft)]">
                      Consulting session. Manage from the{" "}
                      <Link
                        href="/account/bookings"
                        className="underline decoration-[var(--sr-line)] underline-offset-4 hover:text-[var(--sr-ink)]"
                      >
                        Bookings
                      </Link>{" "}
                      tab.
                    </p>
                  ) : assets.length === 0 ? (
                    <p className="text-[var(--sr-ink-muted)]">No content available yet.</p>
                  ) : (
                    <ul className="flex flex-col divide-y divide-[var(--sr-line-soft)]">
                      {assets.map((a) => (
                        <li key={a.id} className="py-3">
                          <a
                            href={`/api/content/${a.id}`}
                            className="flex items-center justify-between gap-4 group"
                          >
                            <span className="text-[var(--sr-ink)] group-hover:text-[var(--sr-ink-soft)]">
                              {a.displayName}
                            </span>
                            <span className="font-[var(--sr-font-mono)] text-[11px] text-[var(--sr-ink-muted)]">
                              Download →
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}

import { asc, eq } from "drizzle-orm";

import { db, schema } from "@/db";
import { Button } from "@/components/Button";
import { Card, CardBody, CardTitle } from "@/components/Card";
import { Input } from "@/components/Input";
import { deleteAssetAction, uploadAssetAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminContent() {
  const plans = await db
    .select({
      planId: schema.plans.id,
      productId: schema.plans.productId,
      productName: schema.products.name,
    })
    .from(schema.plans)
    .innerJoin(schema.products, eq(schema.products.id, schema.plans.productId))
    .orderBy(asc(schema.products.name));

  const assetsRaw = plans.length
    ? await db.select().from(schema.contentAssets).orderBy(asc(schema.contentAssets.order))
    : [];

  const assetsByPlan = new Map<string, typeof assetsRaw>();
  for (const a of assetsRaw) {
    const list = assetsByPlan.get(a.planId) ?? [];
    list.push(a);
    assetsByPlan.set(a.planId, list);
  }

  return (
    <main className="max-w-4xl mx-auto p-[var(--space-6)] flex flex-col gap-[var(--space-6)]">
      <h1 className="text-[var(--font-size-2xl)] font-semibold">Content</h1>

      {plans.length === 0 ? (
        <Card>
          <CardBody>No plans yet — create one in Products.</CardBody>
        </Card>
      ) : (
        plans.map((p) => {
          const assets = assetsByPlan.get(p.planId) ?? [];
          return (
            <Card key={p.planId}>
              <CardTitle>{p.productName}</CardTitle>
              <CardBody className="flex flex-col gap-[var(--space-3)]">
                {assets.length === 0 ? (
                  <p className="text-[var(--color-muted)]">No assets.</p>
                ) : (
                  <ul className="flex flex-col gap-[var(--space-2)]">
                    {assets.map((a) => (
                      <li
                        key={a.id}
                        className="flex items-center justify-between border border-[var(--color-border)] rounded-[var(--radius-sm)] p-[var(--space-2)]"
                      >
                        <div>
                          <div>{a.displayName}</div>
                          <div className="text-[var(--color-muted)] text-[var(--font-size-sm)]">
                            {a.mime} · order {a.order}
                          </div>
                        </div>
                        <form action={deleteAssetAction}>
                          <input type="hidden" name="id" value={a.id} />
                          <Button type="submit" variant="ghost" size="sm">Delete</Button>
                        </form>
                      </li>
                    ))}
                  </ul>
                )}

                <form
                  action={uploadAssetAction}
                  encType="multipart/form-data"
                  className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_auto] gap-[var(--space-2)] pt-[var(--space-3)] border-t border-[var(--color-border)]"
                >
                  <input type="hidden" name="planId" value={p.planId} />
                  <Input type="file" name="file" required />
                  <Input name="displayName" placeholder="Display name" required />
                  <Button type="submit" variant="primary">Upload</Button>
                </form>
              </CardBody>
            </Card>
          );
        })
      )}
    </main>
  );
}

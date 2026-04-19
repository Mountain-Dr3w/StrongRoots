import { and, asc, eq, ilike, isNull } from "drizzle-orm";

import { db, schema } from "@/db";
import { Button } from "@/components/Button";
import { Card, CardBody, CardTitle } from "@/components/Card";
import { Input } from "@/components/Input";
import { grantEntitlementAction, revokeEntitlementAction } from "./actions";

type SP = Promise<{ q?: string; user?: string }>;

export const dynamic = "force-dynamic";

export default async function AdminCustomers({ searchParams }: { searchParams: SP }) {
  const { q, user: userId } = await searchParams;
  const filter = (q ?? "").trim();

  const users = filter
    ? await db
        .select()
        .from(schema.users)
        .where(ilike(schema.users.email, `%${filter}%`))
        .orderBy(asc(schema.users.email))
    : await db.select().from(schema.users).orderBy(asc(schema.users.email)).limit(50);

  const selected = userId
    ? await db.query.users.findFirst({ where: eq(schema.users.id, userId) })
    : null;

  const entitlements = selected
    ? await db
        .select({
          id: schema.entitlements.id,
          productId: schema.entitlements.productId,
          productName: schema.products.name,
          grantedAt: schema.entitlements.grantedAt,
          revokedAt: schema.entitlements.revokedAt,
        })
        .from(schema.entitlements)
        .innerJoin(schema.products, eq(schema.products.id, schema.entitlements.productId))
        .where(eq(schema.entitlements.userId, selected.id))
    : [];

  const allProducts = selected
    ? await db.select().from(schema.products).where(eq(schema.products.active, true))
    : [];

  return (
    <main className="max-w-6xl mx-auto p-[var(--space-6)] grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-[var(--space-6)]">
      <Card>
        <CardTitle>Customers</CardTitle>
        <CardBody className="flex flex-col gap-[var(--space-3)]">
          <form className="flex gap-[var(--space-2)]">
            <Input name="q" defaultValue={filter} placeholder="email contains..." />
            <Button type="submit" variant="primary">Search</Button>
          </form>
          <div className="flex flex-col gap-[var(--space-1)]">
            {users.map((u) => (
              <a
                key={u.id}
                href={`/admin/customers?user=${u.id}${filter ? `&q=${encodeURIComponent(filter)}` : ""}`}
                className={
                  selected?.id === u.id
                    ? "block px-[var(--space-2)] py-[var(--space-1)] rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                    : "block px-[var(--space-2)] py-[var(--space-1)] rounded-[var(--radius-sm)] hover:bg-[var(--color-surface)]"
                }
              >
                {u.email} {u.role === "admin" ? "(admin)" : null}
              </a>
            ))}
          </div>
        </CardBody>
      </Card>

      {selected ? (
        <Card>
          <CardTitle>{selected.email}</CardTitle>
          <CardBody className="flex flex-col gap-[var(--space-4)]">
            <div className="text-[var(--color-muted)]">Role: {selected.role} · TZ: {selected.timezone}</div>

            <div>
              <h3 className="font-medium mb-[var(--space-2)]">Entitlements</h3>
              {entitlements.length === 0 ? (
                <p className="text-[var(--color-muted)]">None.</p>
              ) : (
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {entitlements.map((e) => (
                    <li
                      key={e.id}
                      className="flex items-center justify-between border border-[var(--color-border)] rounded-[var(--radius-sm)] p-[var(--space-2)]"
                    >
                      <span>
                        {e.productName}
                        {e.revokedAt ? <em className="text-[var(--color-muted)]"> — revoked</em> : null}
                      </span>
                      {!e.revokedAt ? (
                        <form action={revokeEntitlementAction}>
                          <input type="hidden" name="entitlementId" value={e.id} />
                          <input type="hidden" name="userId" value={selected.id} />
                          <Button type="submit" variant="ghost" size="sm">Revoke</Button>
                        </form>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-[var(--space-2)]">Grant entitlement</h3>
              <form action={grantEntitlementAction} className="flex gap-[var(--space-2)]">
                <input type="hidden" name="userId" value={selected.id} />
                <select
                  name="productId"
                  required
                  className="flex-1 h-10 px-3 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-border)]"
                >
                  {allProducts.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <Button type="submit" variant="primary">Grant</Button>
              </form>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody>Select a customer to manage entitlements.</CardBody>
        </Card>
      )}
    </main>
  );
}

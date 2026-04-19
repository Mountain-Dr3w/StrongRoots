import Link from "next/link";
import { asc } from "drizzle-orm";

import { db, schema } from "@/db";
import { Button } from "@/components/Button";
import { Card, CardBody, CardTitle } from "@/components/Card";

export const dynamic = "force-dynamic";

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function AdminProducts() {
  const products = await db
    .select()
    .from(schema.products)
    .orderBy(asc(schema.products.name));

  return (
    <main className="max-w-6xl mx-auto p-[var(--space-6)] flex flex-col gap-[var(--space-6)]">
      <div className="flex items-center justify-between">
        <h1 className="text-[var(--font-size-2xl)] font-semibold">Products</h1>
        <Link href="/admin/products/new">
          <Button variant="primary">New product</Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardBody>No products yet.</CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-4)]">
          {products.map((p) => (
            <Link key={p.id} href={`/admin/products/${p.id}`} className="block">
              <Card className="hover:border-[var(--color-accent)] transition">
                <div className="text-[var(--font-size-xs)] uppercase tracking-wide text-[var(--color-muted)]">
                  {p.type} {p.active ? "" : "· inactive"}
                </div>
                <CardTitle>{p.name}</CardTitle>
                <CardBody className="flex items-baseline justify-between">
                  <span>{formatPrice(p.priceCents)}</span>
                  <span className="text-[var(--color-muted)] text-[var(--font-size-sm)]">
                    {p.slug}
                  </span>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

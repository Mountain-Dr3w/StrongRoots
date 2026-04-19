import Link from "next/link";
import { and, eq } from "drizzle-orm";

import { db, schema } from "@/db";
import { Card, CardBody, CardTitle } from "@/components/Card";

type ShopSearchParams = Promise<{ type?: string }>;

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function typeLabel(t: "plan" | "consulting"): string {
  return t === "plan" ? "Plan" : "Consulting";
}

export const dynamic = "force-dynamic";

export default async function ShopPage({ searchParams }: { searchParams: ShopSearchParams }) {
  const { type } = await searchParams;
  const filter = type === "plan" || type === "consulting" ? type : undefined;

  const products = await db
    .select()
    .from(schema.products)
    .where(
      filter
        ? and(eq(schema.products.active, true), eq(schema.products.type, filter))
        : eq(schema.products.active, true),
    );

  return (
    <main className="min-h-screen p-[var(--space-8)]">
      <div className="max-w-5xl mx-auto flex flex-col gap-[var(--space-6)]">
        <header className="flex items-end justify-between flex-wrap gap-[var(--space-3)]">
          <h1 className="text-[var(--font-size-2xl)] font-semibold">Shop</h1>
          <nav className="flex gap-[var(--space-2)] text-[var(--font-size-sm)]">
            <FilterLink current={filter} value={undefined}>All</FilterLink>
            <FilterLink current={filter} value="plan">Plans</FilterLink>
            <FilterLink current={filter} value="consulting">Consulting</FilterLink>
          </nav>
        </header>

        {products.length === 0 ? (
          <p className="text-[var(--color-muted)]">No products yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--space-4)]">
            {products.map((p) => (
              <Link key={p.id} href={`/shop/${p.slug}`} className="block">
                <Card className="h-full hover:border-[var(--color-accent)] transition">
                  <div className="text-[var(--font-size-xs)] uppercase tracking-wide text-[var(--color-muted)] mb-[var(--space-1)]">
                    {typeLabel(p.type)}
                  </div>
                  <CardTitle>{p.name}</CardTitle>
                  <CardBody className="flex flex-col gap-[var(--space-2)]">
                    {p.description ? (
                      <p className="text-[var(--color-muted)] text-[var(--font-size-sm)] line-clamp-3">
                        {p.description}
                      </p>
                    ) : null}
                    <div className="text-[var(--font-size-lg)] font-semibold">
                      {formatPrice(p.priceCents)}
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function FilterLink({
  current,
  value,
  children,
}: {
  current: "plan" | "consulting" | undefined;
  value: "plan" | "consulting" | undefined;
  children: React.ReactNode;
}) {
  const active = current === value;
  const href = value ? `/shop?type=${value}` : "/shop";
  return (
    <Link
      href={href}
      className={
        active
          ? "px-[var(--space-3)] py-[var(--space-1)] rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
          : "px-[var(--space-3)] py-[var(--space-1)] rounded-[var(--radius-sm)] text-[var(--color-fg)] hover:bg-[var(--color-surface)]"
      }
    >
      {children}
    </Link>
  );
}

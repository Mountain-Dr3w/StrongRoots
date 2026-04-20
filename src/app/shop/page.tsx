import Link from "next/link";
import { and, eq } from "drizzle-orm";

import { db, schema } from "@/db";
import { cn } from "@/lib/cn";
import { Card, CardBody, CardImage, CardTitle } from "@/components/Card";
import { Eyebrow } from "@/components/site/Eyebrow";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteShell } from "@/components/site/SiteShell";
import { StripedPlaceholder } from "@/components/site/StripedPlaceholder";

type ShopSearchParams = Promise<{ type?: string }>;

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

const PLAN_COVERS = ["/stock/plan-rack.jpg", "/stock/plan-onboarding.jpg", "/stock/plan-back.jpg"];
const CONSULTING_COVERS = ["/stock/consult.jpg", "/stock/nutrition.jpg", "/stock/portrait.jpg"];

function coverFor(type: "plan" | "consulting", idx: number): string {
  const pool = type === "plan" ? PLAN_COVERS : CONSULTING_COVERS;
  return pool[idx % pool.length];
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
    <SiteShell>
      <section className="px-6 md:px-10 pt-12 md:pt-20 pb-24 md:pb-32">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <SectionHeading
            eyebrow="Applications · Digital plans"
            title={
              filter === "consulting"
                ? "Work with Ashlyn."
                : filter === "plan"
                  ? "Programs, on demand."
                  : "The whole shop."
            }
            subtitle="Buy a plan for lifetime access, or book a consulting slot for a monthly conversation."
            action={
              <nav className="flex gap-2" aria-label="Filter products">
                <FilterLink current={filter} value={undefined}>
                  All
                </FilterLink>
                <FilterLink current={filter} value="plan">
                  Plans
                </FilterLink>
                <FilterLink current={filter} value="consulting">
                  Consulting
                </FilterLink>
              </nav>
            }
          />

          {products.length === 0 ? (
            <p className="text-[var(--sr-ink-soft)] text-[17px]">
              No products yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p, idx) => (
                <Link key={p.id} href={`/shop/${p.slug}`} className="block group">
                  <Card className="h-full flex flex-col transition-colors group-hover:border-[var(--sr-ink)]">
                    <CardImage>
                      <StripedPlaceholder
                        label={p.type === "plan" ? `plan · ${p.slug}` : `${p.slug} · 1:1`}
                        src={coverFor(p.type, idx)}
                        aspect={false}
                        className="h-full"
                      />
                    </CardImage>
                    <CardBody className="flex flex-col gap-3 flex-1">
                      <div className="flex items-baseline justify-between gap-4">
                        <Eyebrow className="text-[10px]">
                          Program №{String(idx + 1).padStart(2, "0")}
                        </Eyebrow>
                        <span className="font-[var(--sr-font-mono)] text-[11px] text-[var(--sr-ink-muted)]">
                          {p.type === "plan" ? "Lifetime" : "Monthly"}
                        </span>
                      </div>
                      <CardTitle className="mb-0">{p.name}</CardTitle>
                      {p.description ? (
                        <p className="text-[var(--sr-ink-soft)] text-[14px] leading-[var(--sr-lh-normal)] line-clamp-3">
                          {p.description}
                        </p>
                      ) : null}
                      <div className="mt-auto pt-4 border-t border-[var(--sr-line-soft)] flex items-baseline justify-between">
                        <span className="font-[var(--sr-font-display)] text-[26px] text-[var(--sr-ink)]">
                          {formatPrice(p.priceCents)}
                        </span>
                        <span className="inline-flex items-center gap-2 font-[var(--sr-font-label)] text-[11px] uppercase tracking-[var(--sr-label-tracking)] text-[var(--sr-ink)] font-semibold">
                          View plan
                          <svg width="10" height="10" viewBox="0 0 14 14" fill="none" aria-hidden>
                            <path
                              d="M1 7h12M8 2l5 5-5 5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="square"
                            />
                          </svg>
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
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
      className={cn(
        "px-4 py-2 text-[11px] uppercase font-[var(--sr-font-label)] tracking-[var(--sr-label-tracking)]",
        "border rounded-[var(--sr-radius-md)] transition-colors",
        active
          ? "bg-[var(--sr-accent)] text-[var(--sr-accent-ink)] border-[var(--sr-accent)]"
          : "text-[var(--sr-ink-soft)] border-[var(--sr-line)] hover:border-[var(--sr-ink)] hover:text-[var(--sr-ink)]",
      )}
    >
      {children}
    </Link>
  );
}

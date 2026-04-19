import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { and, eq } from "drizzle-orm";

import { db, schema } from "@/db";
import { Button } from "@/components/Button";
import { Card, CardBody, CardTitle } from "@/components/Card";
import { FaqAccordion } from "@/components/FaqAccordion";
import { buyPlanAction, bookConsultingAction } from "./actions";

type PageParams = Promise<{ slug: string }>;

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

async function loadProduct(slug: string) {
  const product = await db.query.products.findFirst({
    where: and(eq(schema.products.slug, slug), eq(schema.products.active, true)),
  });
  if (!product) return null;

  if (product.type === "plan") {
    const plan = await db.query.plans.findFirst({
      where: eq(schema.plans.productId, product.id),
    });
    return { product, plan, offering: null } as const;
  }

  const offering = await db.query.consultingOfferings.findFirst({
    where: eq(schema.consultingOfferings.productId, product.id),
  });
  return { product, plan: null, offering } as const;
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadProduct(slug);
  if (!data) return { title: "Not found" };

  const { product } = data;
  return {
    title: `${product.name} — StrongRoots`,
    description: product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      type: "website",
    },
  };
}

const FAQ_ITEMS = [
  {
    question: "How long do I have access?",
    answer:
      "For plans: lifetime access to the content you purchase. For consulting: your session is scheduled for the time you book.",
  },
  {
    question: "What's your refund policy?",
    answer: "Full refund within 7 days for plans. Consulting sessions can be rescheduled up to 24 hours in advance.",
  },
  {
    question: "Do I need equipment?",
    answer: "Plans indicate equipment requirements in the description. Most beginner plans require only bodyweight.",
  },
];

export default async function ProductDetailPage({ params }: { params: PageParams }) {
  const { slug } = await params;
  const data = await loadProduct(slug);
  if (!data) notFound();

  const { product, plan, offering } = data;

  return (
    <main className="min-h-screen p-[var(--space-8)]">
      <div className="max-w-3xl mx-auto flex flex-col gap-[var(--space-6)]">
        <div className="text-[var(--font-size-xs)] uppercase tracking-wide text-[var(--color-muted)]">
          {product.type === "plan" ? "Plan" : "Consulting"}
        </div>
        <h1 className="text-[var(--font-size-2xl)] font-semibold">{product.name}</h1>
        {product.description ? (
          <p className="text-[var(--color-muted)]">{product.description}</p>
        ) : null}

        <Card>
          <CardTitle>What's included</CardTitle>
          <CardBody>
            {plan ? (
              <ul className="list-disc pl-[var(--space-6)]">
                <li>{plan.weeks}-week program</li>
                <li>Level: {plan.level}</li>
                <li>Downloadable content bundle</li>
              </ul>
            ) : null}
            {offering ? (
              <ul className="list-disc pl-[var(--space-6)]">
                <li>{offering.durationMinutes}-minute 1:1 session with Ashlyn</li>
                {offering.requiresIntake ? <li>Intake form to tailor the session</li> : null}
                {offering.requiresDeposit ? <li>Deposit required at booking</li> : null}
              </ul>
            ) : null}
          </CardBody>
        </Card>

        <div className="flex items-center justify-between gap-[var(--space-4)] flex-wrap">
          <div className="text-[var(--font-size-2xl)] font-semibold">
            {formatPrice(product.priceCents)}
          </div>
          {product.type === "plan" ? (
            <form action={buyPlanAction}>
              <input type="hidden" name="productId" value={product.id} />
              <Button type="submit" variant="primary" size="lg">
                Buy now
              </Button>
            </form>
          ) : (
            <form action={bookConsultingAction}>
              <input type="hidden" name="slug" value={product.slug} />
              <Button type="submit" variant="primary" size="lg">
                Book a session
              </Button>
            </form>
          )}
        </div>

        <section className="flex flex-col gap-[var(--space-3)]">
          <h2 className="text-[var(--font-size-xl)] font-semibold">FAQ</h2>
          <FaqAccordion items={FAQ_ITEMS} />
        </section>
      </div>
    </main>
  );
}

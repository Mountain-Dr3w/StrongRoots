import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { and, eq } from "drizzle-orm";

import { db, schema } from "@/db";
import { Button } from "@/components/Button";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Eyebrow } from "@/components/site/Eyebrow";
import { SessionLog, type SessionLogData } from "@/components/site/SessionLog";
import { SiteShell } from "@/components/site/SiteShell";
import { StripedPlaceholder } from "@/components/site/StripedPlaceholder";
import { buyPlanAction, bookConsultingAction } from "./actions";

type PageParams = Promise<{ slug: string }>;

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
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
    title: product.name,
    description: product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      type: "website",
    },
  };
}

const SAMPLE_SESSION: SessionLogData = {
  dayLabel: "Day 24",
  blockLabel: "Block 02 · Build",
  sessionTitle: "Lower · Heavy",
  durationMinutes: 45,
  rows: [
    { slot: "A1", exercise: "Back squat", scheme: "4 × 5", load: "225 lb", rpe: "7" },
    { slot: "A2", exercise: "Romanian deadlift", scheme: "3 × 8", load: "185 lb", rpe: "6" },
    { slot: "B1", exercise: "Bulgarian split squat", scheme: "3 × 10", load: "BW + 20", rpe: "7" },
    { slot: "B2", exercise: "Ab rollout", scheme: "3 × 12", load: "BW", rpe: null },
    {
      slot: "C",
      exercise: "Sled push",
      scheme: "5 × 20 yd",
      load: "+90 lb",
      rpe: null,
      notes: "walking pace, nasal breathing",
    },
  ],
  coachNote:
    "Cap RPE at 7 through the build block so we can carry the load into test week. If the last set of squats feels like a 9, stop there. Log the rep count and we'll adjust.",
};

const FAQ_ITEMS = [
  {
    question: "How long do I have access?",
    answer:
      "Plans come with lifetime access to the content you purchase. Consulting sessions are scheduled for the time you book.",
  },
  {
    question: "What's your refund policy?",
    answer:
      "Full refund within 7 days for plans. Consulting sessions can be rescheduled up to 24 hours in advance.",
  },
  {
    question: "Do I need equipment?",
    answer:
      "Plans indicate equipment requirements in the description. Most beginner plans require only bodyweight.",
  },
];

export default async function ProductDetailPage({ params }: { params: PageParams }) {
  const { slug } = await params;
  const data = await loadProduct(slug);
  if (!data) notFound();

  const { product, plan, offering } = data;
  const typeLabel = product.type === "plan" ? "Plan" : "Consulting";
  const cadenceLabel = product.type === "plan" ? "One-time · lifetime" : "Monthly · recurring";

  return (
    <SiteShell>
      <article className="px-6 md:px-10 pt-10 md:pt-16 pb-24 md:pb-32">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.05fr_0.95fr] gap-10 md:gap-16 items-start">
          {/* Visual */}
          <StripedPlaceholder
            label={`${typeLabel.toLowerCase()} · ${product.slug}`}
            src={product.type === "plan" ? "/stock/plan-rack.jpg" : "/stock/consulting.jpg"}
            aspect="4/5"
            className="w-full md:sticky md:top-28"
            priority
          />

          {/* Detail */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <Eyebrow>{typeLabel}</Eyebrow>
              <h1 className="font-[var(--sr-font-display)] font-normal text-[var(--sr-ink)] text-[40px] md:text-[64px] leading-[var(--sr-lh-tight)] tracking-[-0.02em]">
                {product.name}
              </h1>
              {product.description ? (
                <p className="text-[var(--sr-ink-soft)] text-[17px] leading-[var(--sr-lh-normal)]">
                  {product.description}
                </p>
              ) : null}
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 py-5 border-y border-[var(--sr-line-soft)]">
              {plan ? (
                <>
                  <Meta label="Duration" value={`${plan.weeks} weeks`} />
                  <Meta label="Level" value={plan.level} />
                  <Meta label="Format" value="PDF + video" />
                </>
              ) : offering ? (
                <>
                  <Meta label="Duration" value={`${offering.durationMinutes} min`} />
                  <Meta label="Format" value="Video call" />
                  {offering.requiresDeposit ? <Meta label="Deposit" value="Required" /> : null}
                </>
              ) : null}
            </div>

            {/* What's included */}
            <div className="flex flex-col gap-4">
              <Eyebrow>What's included</Eyebrow>
              <ul className="flex flex-col gap-3 text-[var(--sr-ink)] text-[15px] leading-[var(--sr-lh-relaxed)]">
                {plan ? (
                  <>
                    <Bullet>A {plan.weeks}-week progressive program built in blocks</Bullet>
                    <Bullet>Programmed for {plan.level}</Bullet>
                    <Bullet>Downloadable content bundle with video demos</Bullet>
                    <Bullet>Lifetime access. No subscription.</Bullet>
                  </>
                ) : null}
                {offering ? (
                  <>
                    <Bullet>
                      {offering.durationMinutes}-minute 1:1 video session with Ashlyn
                    </Bullet>
                    {offering.requiresIntake ? (
                      <Bullet>Intake form you fill out before the call</Bullet>
                    ) : null}
                    {offering.requiresDeposit ? (
                      <Bullet>Deposit charged at booking, applied to your month</Bullet>
                    ) : null}
                    <Bullet>Follow-up notes and next-session work after each call</Bullet>
                  </>
                ) : null}
              </ul>
            </div>

            {/* Sample session — plans only */}
            {product.type === "plan" ? (
              <div className="flex flex-col gap-4">
                <Eyebrow>What a session looks like</Eyebrow>
                <SessionLog data={SAMPLE_SESSION} />
                <p className="font-[var(--sr-font-mono)] text-[11px] text-[var(--sr-ink-muted)]">
                  Sample session from Built to Last · block 02, week 8.
                </p>
              </div>
            ) : null}

            {/* Price + CTA */}
            <div className="flex flex-wrap items-end justify-between gap-6 pt-6 border-t border-[var(--sr-line-soft)]">
              <div className="flex flex-col gap-1">
                <span className="font-[var(--sr-font-display)] text-[56px] leading-[1] text-[var(--sr-ink)]">
                  {formatPrice(product.priceCents)}
                </span>
                <Eyebrow className="text-[10px]">{cadenceLabel}</Eyebrow>
              </div>
              {product.type === "plan" ? (
                <form action={buyPlanAction}>
                  <input type="hidden" name="productId" value={product.id} />
                  <Button type="submit" variant="primary" size="lg">
                    Begin program
                  </Button>
                </form>
              ) : (
                <form action={bookConsultingAction}>
                  <input type="hidden" name="slug" value={product.slug} />
                  <Button type="submit" variant="primary" size="lg">
                    Book intake call
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto mt-24 md:mt-32">
          <div className="flex flex-col gap-4 mb-8">
            <Eyebrow>Questions</Eyebrow>
            <h2 className="font-[var(--sr-font-display)] font-normal text-[var(--sr-ink)] text-[36px] md:text-[44px] leading-[var(--sr-lh-snug)] tracking-[-0.01em]">
              Before you buy.
            </h2>
          </div>
          <FaqAccordion items={FAQ_ITEMS} />
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              description: product.description ?? undefined,
              offers: {
                "@type": "Offer",
                priceCurrency: "USD",
                price: (product.priceCents / 100).toFixed(2),
                availability: product.active
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              },
            }),
          }}
        />
      </article>
    </SiteShell>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <Eyebrow className="text-[10px]">{label}</Eyebrow>
      <span className="font-[var(--sr-font-mono)] text-[13px] text-[var(--sr-ink)]">
        {value}
      </span>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="text-[var(--sr-ink-muted)] font-semibold shrink-0">·</span>
      <span>{children}</span>
    </li>
  );
}

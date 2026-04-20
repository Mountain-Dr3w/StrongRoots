import Link from "next/link";

import { Button } from "@/components/Button";
import { Card, CardBody, CardImage, CardTitle } from "@/components/Card";
import { BlockReceipt, type BlockReceiptData } from "@/components/site/BlockReceipt";
import { Eyebrow } from "@/components/site/Eyebrow";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteShell } from "@/components/site/SiteShell";
import { StripedPlaceholder } from "@/components/site/StripedPlaceholder";

const HERO_PANES = [
  { label: "01 · program", src: "/stock/hero-lift.jpg" },
  { label: "02 · consult", src: "/stock/trainer.jpg" },
  { label: "03 · nourish", src: "/stock/nutrition.jpg" },
];

const SAMPLE_BLOCK: BlockReceiptData = {
  clientInitial: "M.R.",
  programName: "Built to Last",
  programNumber: "01",
  dateRange: "Jan 8 to Apr 2",
  sessionsCompleted: 42,
  sessionsProgrammed: 48,
  loadDeltaPct: 34,
  missedCount: 2,
  missedNote: "both conditioning days",
  lifts: [
    { name: "Back squat", from: 205, to: 225, unit: "lb" },
    { name: "Bench press", from: 155, to: 165, unit: "lb" },
    { name: "Romanian deadlift", from: 245, to: 260, unit: "lb" },
    { name: "Chin-up", from: 5, to: 8, unit: "reps" },
  ],
};

const PILLARS = [
  {
    eyebrow: "Programs",
    title: "Plans, on demand",
    body:
      "Eight to sixteen-week programs. Full PDFs and video demonstrations. Train on your schedule.",
    href: "/shop?type=plan",
    cta: "Browse plans",
    label: "rack work",
    src: "/stock/plan-rack.jpg",
  },
  {
    eyebrow: "Consulting",
    title: "Work with Ashlyn",
    body:
      "Monthly 1:1 consulting in three tiers. Weekly video check-ins, form review, and programs built to match your training block.",
    href: "/shop?type=consulting",
    cta: "See tiers",
    label: "check-in",
    src: "/stock/trainer.jpg",
  },
  {
    eyebrow: "Nutrition",
    title: "Eat for the long arc",
    body:
      "Macro targets and food frameworks bundled into Practice and Performance. Food is training you do three times a day.",
    href: "/shop?type=consulting",
    cta: "Book intake",
    label: "plate",
    src: "/stock/nutrition.jpg",
  },
];

export default function Home() {
  return (
    <SiteShell>
      {/* ── Hero — split-tri with overlay card ─────────────────── */}
      <section className="relative px-6 md:px-10 pt-10 md:pt-16 pb-24 md:pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-3 md:gap-5 h-[420px] md:h-[520px]">
            {HERO_PANES.map((pane, idx) => (
              <StripedPlaceholder
                key={pane.label}
                label={pane.label}
                src={pane.src}
                aspect={false}
                className="h-full"
                priority={idx === 0}
              />
            ))}
          </div>

          <div className="relative md:-mt-24 mt-6">
            <div className="bg-[var(--sr-bg)] md:pt-8 md:pr-10 md:pb-8 py-6 max-w-2xl md:border-r md:border-t border-[var(--sr-line-soft)]">
              <Eyebrow>Strong Roots · Est. training practice</Eyebrow>
              <h1 className="mt-4 font-[var(--sr-font-display)] font-normal text-[var(--sr-ink)] text-[48px] sm:text-[64px] md:text-[72px] leading-[0.98] tracking-[-0.02em] text-balance">
                Build strength that stays.
              </h1>
              <p className="mt-6 text-[var(--sr-ink-soft)] text-[17px] leading-[var(--sr-lh-normal)] max-w-lg">
                Structured programs and 1:1 consulting from Ashlyn, for people who are tired of starting over. Train for the long arc.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/shop?type=plan">
                  <Button variant="primary" size="lg">
                    Browse plans
                  </Button>
                </Link>
                <Link href="/shop?type=consulting">
                  <Button variant="secondary" size="lg">
                    Book a call
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three pillars ──────────────────────────────────────── */}
      <section className="px-6 md:px-10 pb-24 md:pb-32">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          <SectionHeading
            eyebrow="The practice"
            title="What's on offer."
            subtitle="Programs, consulting, and nutrition. Pick one or stack them. The goal is the same: sustainable strength you keep."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map((pillar) => (
              <Card key={pillar.eyebrow} className="flex flex-col">
                <CardImage>
                  <StripedPlaceholder
                    label={pillar.label}
                    src={pillar.src}
                    aspect={false}
                    className="h-full"
                  />
                </CardImage>
                <CardBody className="flex flex-col gap-4 flex-1">
                  <Eyebrow>{pillar.eyebrow}</Eyebrow>
                  <CardTitle className="mb-0">{pillar.title}</CardTitle>
                  <p className="text-[var(--sr-ink-soft)] leading-[var(--sr-lh-normal)]">
                    {pillar.body}
                  </p>
                  <div className="mt-auto pt-4 border-t border-[var(--sr-line-soft)]">
                    <Link
                      href={pillar.href}
                      className="inline-flex items-center gap-2 font-[var(--sr-font-label)] text-[11px] uppercase tracking-[var(--sr-label-tracking)] text-[var(--sr-ink)] hover:text-[var(--sr-ink-soft)]"
                    >
                      {pillar.cta}
                      <svg width="10" height="10" viewBox="0 0 14 14" fill="none" aria-hidden>
                        <path
                          d="M1 7h12M8 2l5 5-5 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="square"
                        />
                      </svg>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Block receipt — the training-tool anchor ──────────── */}
      <section className="px-6 md:px-10 pb-24 md:pb-32">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          <SectionHeading
            eyebrow="A block, accounted for"
            title="Twelve weeks, written down."
            subtitle="An illustrative sample block. Real client numbers will replace this once one opts in to share."
            action={
              <Link href="/shop?type=plan">
                <Button variant="tertiary" size="sm">
                  Browse programs
                </Button>
              </Link>
            }
          />
          <BlockReceipt data={SAMPLE_BLOCK} />
        </div>
      </section>
    </SiteShell>
  );
}

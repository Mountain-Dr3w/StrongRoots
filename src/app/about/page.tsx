import type { Metadata } from "next";

import { Eyebrow } from "@/components/site/Eyebrow";
import { SiteShell } from "@/components/site/SiteShell";
import { StripedPlaceholder } from "@/components/site/StripedPlaceholder";

export const metadata: Metadata = {
  title: "About",
  description: "Meet Ashlyn and learn how Strong Roots approaches sustainable strength training.",
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ashlyn",
  jobTitle: "Personal Trainer",
  url: "https://strongroots.example/about",
  sameAs: [],
};

const PRINCIPLES = [
  {
    title: "Start with a clear block.",
    body:
      "Every program has a defined stretch of work, a progression to follow, and a reason for what is in it.",
  },
  {
    title: "Adjust from evidence.",
    body:
      "Sessions, loads, missed days, and form feedback tell us what to change. The calendar alone does not.",
  },
  {
    title: "Keep training livable.",
    body:
      "The goal is consistent work you can return to. Coaching makes room for schedule changes, recovery, and the rest of your life.",
  },
];

export default function AboutPage() {
  return (
    <SiteShell>
      {/* ── Editorial hero ─────────────────────────────────────── */}
      <section className="px-6 md:px-10 pt-12 md:pt-20 pb-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-16 items-end">
          <div>
            <Eyebrow>About</Eyebrow>
            <h1 className="mt-5 font-[var(--sr-font-display)] font-normal text-[var(--sr-ink)] text-[48px] sm:text-[64px] md:text-[88px] leading-[0.98] tracking-[-0.025em] text-balance">
              Training for the long arc.
            </h1>
            <p className="mt-8 text-[var(--sr-ink-soft)] text-[17px] leading-[var(--sr-lh-normal)] max-w-lg">
              Strong Roots pairs structured strength work with the feedback that keeps it
              useful. Programs stand on their own; coaching adds review, adjustment, and
              direct conversation with Ashlyn.
            </p>
          </div>
          <StripedPlaceholder
            label="method · review"
            src="/editorial/coaching-review.jpg"
            alt="A coach reviewing exercise footage beside a training notebook"
            aspect="4/5"
            className="w-full max-w-md md:ml-auto"
            priority
          />
        </div>
      </section>

      {/* ── Principles ─────────────────────────────────────────── */}
      <section className="px-6 md:px-10 pb-24 md:pb-32">
        <div className="max-w-6xl mx-auto border-t border-[var(--sr-line-soft)] pt-16">
          <Eyebrow>How I work</Eyebrow>
          <div className="mt-10 grid md:grid-cols-3 gap-10 md:gap-14">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="flex flex-col gap-4">
                <h3 className="font-[var(--sr-font-display)] font-normal text-[var(--sr-ink)] text-[28px] leading-[var(--sr-lh-snug)]">
                  {p.title}
                </h3>
                <p className="text-[var(--sr-ink-soft)] leading-[var(--sr-lh-relaxed)]">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
    </SiteShell>
  );
}

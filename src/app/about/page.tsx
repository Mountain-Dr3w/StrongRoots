import type { Metadata } from "next";

import { Eyebrow } from "@/components/site/Eyebrow";
import { SiteShell } from "@/components/site/SiteShell";
import { StripedPlaceholder } from "@/components/site/StripedPlaceholder";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ashlyn is a trainer who turned her own recovery into a system others can use.",
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
    title: "Training should repair, not punish.",
    body:
      "Programs progress in blocks. Sessions check in. Loads go up when the body is ready, not because the calendar says so.",
  },
  {
    title: "Strength is a practice, not a project.",
    body:
      "Reps, weeks, and the slow compound of doing the work most days. No before/after photos. No transformation language.",
  },
  {
    title: "If a plan doesn't fit, we talk.",
    body:
      "Consulting is a conversation. The 12-week program you bought is where we start, not where we're stuck.",
  },
];

export default function AboutPage() {
  return (
    <SiteShell>
      {/* ── Editorial hero ─────────────────────────────────────── */}
      <section className="px-6 md:px-10 pt-12 md:pt-20 pb-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-16 items-end">
          <div>
            <Eyebrow>About the practice</Eyebrow>
            <h1 className="mt-5 font-[var(--sr-font-display)] font-normal text-[var(--sr-ink)] text-[48px] sm:text-[64px] md:text-[88px] leading-[0.98] tracking-[-0.025em] text-balance">
              Ashlyn trains people for the long arc.
            </h1>
            <p className="mt-8 text-[var(--sr-ink-soft)] text-[17px] leading-[var(--sr-lh-normal)] max-w-lg">
              A coach who turned her own recovery into a system. She works mostly online and keeps
              a handful of 1:1 consulting slots each week.
            </p>
          </div>
          <StripedPlaceholder
            label="portrait · ashlyn"
            src="/stock/portrait.jpg"
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

      {/* ── Voice ──────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 pb-24 md:pb-32">
        <div className="max-w-6xl mx-auto border-t border-[var(--sr-line-soft)] pt-16 grid md:grid-cols-2 gap-12">
          <div>
            <Eyebrow>We say</Eyebrow>
            <ul className="mt-6 flex flex-col gap-3">
              {[
                "training practice",
                "long arc",
                "sustainable strength",
                "check-in",
                "block",
                "repair",
              ].map((word) => (
                <li key={word} className="text-[var(--sr-ink)] text-[17px]">
                  · {word}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>We don't</Eyebrow>
            <ul className="mt-6 flex flex-col gap-3">
              {["shred", "crush it", "beast mode", "hack", "transformation", "guru"].map(
                (word) => (
                  <li
                    key={word}
                    className="text-[var(--sr-ink-muted)] text-[17px] line-through"
                  >
                    · {word}
                  </li>
                ),
              )}
            </ul>
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

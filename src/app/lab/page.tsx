import { Eyebrow } from "@/components/site/Eyebrow";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteShell } from "@/components/site/SiteShell";
import { cn } from "@/lib/cn";

export const metadata = {
  title: "Lab · prototypes",
  robots: { index: false, follow: false },
};

export default function LabPage() {
  return (
    <SiteShell>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 md:py-16 flex flex-col gap-24">
        <header className="flex flex-col gap-3">
          <Eyebrow>Lab · unlinked</Eyebrow>
          <h1 className="font-[var(--sr-font-display)] font-normal text-[var(--sr-ink)] text-[48px] md:text-[64px] leading-[var(--sr-lh-tight)] tracking-[-0.02em]">
            Training-tool prototypes.
          </h1>
          <p className="text-[var(--sr-ink-soft)] text-[17px] leading-[var(--sr-lh-normal)] max-w-2xl">
            Three candidate sections for the marketing site, each leaning into the
            training-log aesthetic instead of wellness-brand template moves. Pick
            whichever feels right — or mix them.
          </p>
        </header>

        <PrototypeA />
        <PrototypeB />
        <PrototypeC />
      </div>
    </SiteShell>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* A. "A week" — cadence strip                                              */
/* ──────────────────────────────────────────────────────────────────────── */

const WEEK_SAMPLE: Array<{
  day: string;
  session: string;
  tag: string | null;
  minutes: number | null;
  state: "done" | "today" | "rest" | "scheduled";
}> = [
  { day: "Mon", session: "Lower", tag: "Heavy", minutes: 45, state: "done" },
  { day: "Tue", session: "Upper", tag: "Volume", minutes: 45, state: "done" },
  { day: "Wed", session: "Conditioning", tag: "Z2", minutes: 25, state: "done" },
  { day: "Thu", session: "Lower", tag: "Volume", minutes: 45, state: "today" },
  { day: "Fri", session: "Upper", tag: "Heavy", minutes: 45, state: "scheduled" },
  { day: "Sat", session: "Walk", tag: "Z2", minutes: 20, state: "scheduled" },
  { day: "Sun", session: "Rest", tag: null, minutes: null, state: "rest" },
];

function PrototypeA() {
  return (
    <section className="flex flex-col gap-8">
      <SectionHeading
        eyebrow="Prototype A · cadence"
        title="A week, not a workout."
        subtitle="Shows the rhythm of the practice — what training actually looks like Monday through Sunday. Uses the block-progress + completion-dot grammar from the mobile screens."
        size="sm"
      />

      {/* Meta row above the strip */}
      <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 pb-4 border-b border-[var(--sr-line-soft)]">
        <Eyebrow>Week 07 · Built to Last</Eyebrow>
        <span className="font-[var(--sr-font-mono)] text-[12px] text-[var(--sr-ink-muted)]">
          4 days · ~3h00 load · 58% of block complete
        </span>
      </div>

      <div className="grid grid-cols-7 gap-px bg-[var(--sr-line-soft)] border border-[var(--sr-line-soft)]">
        {WEEK_SAMPLE.map((d) => {
          const isRest = d.state === "rest";
          const isToday = d.state === "today";
          const isDone = d.state === "done";
          return (
            <div
              key={d.day}
              className={cn(
                "flex flex-col gap-3 p-4 min-h-[180px] bg-[var(--sr-bg)]",
                isToday && "bg-[var(--sr-surface)]",
              )}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-[var(--sr-font-label)] text-[10px] uppercase tracking-[var(--sr-label-tracking)] text-[var(--sr-ink-muted)]">
                  {d.day}
                </span>
                {isToday ? (
                  <span className="font-[var(--sr-font-mono)] text-[9px] uppercase tracking-[0.18em] text-[var(--sr-ink)]">
                    today
                  </span>
                ) : null}
              </div>

              <div className="flex flex-col gap-1">
                <span
                  className={cn(
                    "font-[var(--sr-font-display)] text-[20px] leading-[var(--sr-lh-tight)]",
                    isRest
                      ? "text-[var(--sr-ink-muted)]"
                      : "text-[var(--sr-ink)]",
                  )}
                >
                  {d.session}
                </span>
                {d.tag ? (
                  <span className="font-[var(--sr-font-mono)] text-[11px] text-[var(--sr-ink-soft)]">
                    {d.tag}
                  </span>
                ) : null}
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="font-[var(--sr-font-mono)] text-[11px] text-[var(--sr-ink-muted)]">
                  {d.minutes != null ? `${d.minutes} min` : "—"}
                </span>
                <span
                  className={cn(
                    "w-[10px] h-[10px] rounded-full",
                    isDone && "bg-[var(--sr-accent)]",
                    isToday && "border border-[var(--sr-ink)] bg-transparent",
                    d.state === "scheduled" &&
                      "border border-[var(--sr-line)] bg-transparent",
                    isRest && "bg-transparent",
                  )}
                  aria-hidden
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 font-[var(--sr-font-mono)] text-[11px] text-[var(--sr-ink-muted)]">
        <Legend dot="done">Completed</Legend>
        <Legend dot="today">Today</Legend>
        <Legend dot="scheduled">Scheduled</Legend>
        <Legend dot="rest">Rest</Legend>
      </div>
    </section>
  );
}

function Legend({
  dot,
  children,
}: {
  dot: "done" | "today" | "scheduled" | "rest";
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cn(
          "w-[8px] h-[8px] rounded-full",
          dot === "done" && "bg-[var(--sr-accent)]",
          dot === "today" && "border border-[var(--sr-ink)]",
          dot === "scheduled" && "border border-[var(--sr-line)]",
          dot === "rest" && "bg-transparent",
        )}
      />
      {children}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* B. "A session" — training log                                            */
/* ──────────────────────────────────────────────────────────────────────── */

type SetRow = {
  slot: string;
  exercise: string;
  scheme: string;
  load: string;
  rpe: string | null;
  notes?: string;
};

const SESSION_ROWS: SetRow[] = [
  { slot: "A1", exercise: "Back squat", scheme: "4 × 5", load: "225 lb", rpe: "7" },
  { slot: "A2", exercise: "Romanian deadlift", scheme: "3 × 8", load: "185 lb", rpe: "6" },
  { slot: "B1", exercise: "Bulgarian split squat", scheme: "3 × 10", load: "BW + 20", rpe: "7" },
  { slot: "B2", exercise: "Ab rollout", scheme: "3 × 12", load: "—", rpe: null },
  { slot: "C", exercise: "Sled push", scheme: "5 × 20 yd", load: "+90 lb", rpe: null, notes: "walking pace, nasal breathing" },
];

function PrototypeB() {
  return (
    <section className="flex flex-col gap-8">
      <SectionHeading
        eyebrow="Prototype B · session"
        title="One day, written down."
        subtitle="The most training-tool move: a full session log as marketing content. RPE, rep schemes, slot notation. Reads like the app you'd get, not the landing page."
        size="sm"
      />

      <div className="border border-[var(--sr-line-soft)] bg-[var(--sr-surface)] rounded-[var(--sr-radius-md)] overflow-hidden">
        {/* header bar */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 px-6 md:px-8 py-5 border-b border-[var(--sr-line-soft)]">
          <div className="flex flex-col gap-1">
            <Eyebrow>Day 24 · Block 02 — Build</Eyebrow>
            <span className="font-[var(--sr-font-display)] text-[28px] text-[var(--sr-ink)] leading-[var(--sr-lh-tight)]">
              Lower · Heavy
            </span>
          </div>
          <div className="flex gap-6 font-[var(--sr-font-mono)] text-[12px] text-[var(--sr-ink-soft)]">
            <span>45 min</span>
            <span>avg RPE 6.5</span>
            <span>+3,400 lb net</span>
          </div>
        </div>

        {/* rows */}
        <div className="flex flex-col divide-y divide-[var(--sr-line-soft)]">
          {/* column labels */}
          <div className="hidden md:grid grid-cols-[40px_1fr_100px_110px_60px] items-baseline gap-4 px-6 md:px-8 py-3 font-[var(--sr-font-label)] text-[10px] uppercase tracking-[var(--sr-label-tracking)] text-[var(--sr-ink-muted)]">
            <span>Slot</span>
            <span>Exercise</span>
            <span>Scheme</span>
            <span>Load</span>
            <span className="text-right">RPE</span>
          </div>
          {SESSION_ROWS.map((r) => (
            <div
              key={r.slot}
              className="grid grid-cols-[40px_1fr] md:grid-cols-[40px_1fr_100px_110px_60px] items-baseline gap-2 md:gap-4 px-6 md:px-8 py-4"
            >
              <span className="font-[var(--sr-font-mono)] text-[13px] text-[var(--sr-ink-muted)]">
                {r.slot}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-[var(--sr-ink)] text-[15px]">{r.exercise}</span>
                {r.notes ? (
                  <span className="font-[var(--sr-font-mono)] text-[11px] text-[var(--sr-ink-muted)]">
                    {r.notes}
                  </span>
                ) : null}
                <div className="md:hidden flex gap-3 font-[var(--sr-font-mono)] text-[12px] text-[var(--sr-ink-soft)]">
                  <span>{r.scheme}</span>
                  <span>·</span>
                  <span>{r.load}</span>
                  {r.rpe ? (
                    <>
                      <span>·</span>
                      <span>RPE {r.rpe}</span>
                    </>
                  ) : null}
                </div>
              </div>
              <span className="hidden md:inline font-[var(--sr-font-mono)] text-[13px] text-[var(--sr-ink)]">
                {r.scheme}
              </span>
              <span className="hidden md:inline font-[var(--sr-font-mono)] text-[13px] text-[var(--sr-ink)]">
                {r.load}
              </span>
              <span className="hidden md:inline font-[var(--sr-font-mono)] text-[13px] text-[var(--sr-ink)] text-right">
                {r.rpe ?? "—"}
              </span>
            </div>
          ))}
        </div>

        {/* footer notes */}
        <div className="px-6 md:px-8 py-5 border-t border-[var(--sr-line-soft)] flex flex-col gap-2">
          <Eyebrow className="text-[10px]">Coach note</Eyebrow>
          <p className="text-[var(--sr-ink-soft)] text-[14px] leading-[var(--sr-lh-relaxed)] max-w-2xl">
            Nice work on Tuesday's squats — the depth is locking in. Push load +5 lb this
            block. Keep RPE capped at 7 so we can carry it into test week.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* C. "A block, reviewed" — stats receipt                                   */
/* ──────────────────────────────────────────────────────────────────────── */

type Lift = { name: string; from: number; to: number; unit: string };

const LIFTS: Lift[] = [
  { name: "Back squat", from: 205, to: 225, unit: "lb" },
  { name: "Bench press", from: 155, to: 165, unit: "lb" },
  { name: "Romanian deadlift", from: 245, to: 260, unit: "lb" },
  { name: "Chin-up", from: 5, to: 8, unit: "reps" },
];

function PrototypeC() {
  return (
    <section className="flex flex-col gap-8">
      <SectionHeading
        eyebrow="Prototype C · retrospective"
        title="What you earned."
        subtitle="A stats receipt from a completed block. Borrows the Strava-annual-review / training-log aesthetic — specific numbers, no hype words. What the product actually delivers."
        size="sm"
      />

      <div className="border border-[var(--sr-line-soft)] bg-[var(--sr-bg)]">
        {/* Header */}
        <div className="px-6 md:px-10 py-8 border-b border-[var(--sr-line-soft)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <Eyebrow>Block 02 · complete · Maya R.</Eyebrow>
              <span className="font-[var(--sr-font-display)] text-[40px] md:text-[56px] text-[var(--sr-ink)] leading-[var(--sr-lh-tight)] tracking-[-0.02em]">
                12 weeks, accounted for.
              </span>
            </div>
            <div className="font-[var(--sr-font-mono)] text-[11px] text-[var(--sr-ink-muted)] flex flex-col items-end gap-1">
              <span>Jan 08 — Apr 02</span>
              <span>Built to Last · №01</span>
            </div>
          </div>
        </div>

        {/* Top-line stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--sr-line-soft)] border-b border-[var(--sr-line-soft)]">
          {[
            { label: "Sessions", value: "42", sub: "of 48 programmed" },
            { label: "Net tonnage", value: "218,400 lb", sub: "+34% vs. block 01" },
            { label: "Avg RPE", value: "6.4", sub: "target 6.5–7.0" },
            { label: "Missed", value: "2", sub: "both conditioning days" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-1 px-6 md:px-8 py-6">
              <Eyebrow className="text-[10px]">{s.label}</Eyebrow>
              <span className="font-[var(--sr-font-display)] text-[32px] md:text-[40px] text-[var(--sr-ink)] leading-none tracking-[-0.01em]">
                {s.value}
              </span>
              <span className="font-[var(--sr-font-mono)] text-[11px] text-[var(--sr-ink-muted)]">
                {s.sub}
              </span>
            </div>
          ))}
        </div>

        {/* Lifts */}
        <div className="px-6 md:px-10 py-8 border-b border-[var(--sr-line-soft)]">
          <Eyebrow>Working-set progression</Eyebrow>
          <div className="mt-6 flex flex-col divide-y divide-[var(--sr-line-soft)]">
            {LIFTS.map((l) => {
              const delta = l.to - l.from;
              const pct = Math.round((delta / l.from) * 100);
              return (
                <div
                  key={l.name}
                  className="grid grid-cols-[1fr_auto] md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] items-baseline gap-4 py-4"
                >
                  <span className="text-[var(--sr-ink)] text-[17px] md:text-[20px] font-[var(--sr-font-display)] leading-[var(--sr-lh-tight)]">
                    {l.name}
                  </span>
                  <span className="hidden md:inline font-[var(--sr-font-mono)] text-[14px] text-[var(--sr-ink-soft)]">
                    {l.from} → {l.to} {l.unit}
                  </span>
                  <span className="md:hidden font-[var(--sr-font-mono)] text-[13px] text-[var(--sr-ink-soft)]">
                    +{delta} {l.unit}
                  </span>
                  <span className="hidden md:inline font-[var(--sr-font-mono)] text-[14px] text-[var(--sr-ink)]">
                    +{delta} {l.unit}
                  </span>
                  <span className="hidden md:inline font-[var(--sr-font-mono)] text-[12px] text-[var(--sr-ink-muted)] text-right">
                    +{pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Week strip */}
        <div className="px-6 md:px-10 py-8">
          <Eyebrow>Weeks 01 — 12</Eyebrow>
          <div className="mt-5 grid grid-cols-12 gap-2">
            {Array.from({ length: 12 }, (_, i) => {
              const intensity = [2, 2, 1, 3, 3, 3, 3, 2, 3, 3, 1, 2][i];
              const missed = i === 4 || i === 9;
              return (
                <div key={i} className="flex flex-col gap-2 items-center">
                  <div
                    className={cn(
                      "w-full h-[44px] md:h-[56px]",
                      missed
                        ? "bg-[var(--sr-surface-alt)]"
                        : intensity >= 3
                          ? "bg-[var(--sr-accent)]"
                          : intensity === 2
                            ? "bg-[var(--sr-ink-soft)]"
                            : "bg-[var(--sr-ink-muted)]",
                      missed && "opacity-40",
                    )}
                    aria-hidden
                  />
                  <span className="font-[var(--sr-font-mono)] text-[10px] text-[var(--sr-ink-muted)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-[var(--sr-font-mono)] text-[11px] text-[var(--sr-ink-muted)]">
            <LegendBar className="bg-[var(--sr-accent)]">Heavy</LegendBar>
            <LegendBar className="bg-[var(--sr-ink-soft)]">Volume</LegendBar>
            <LegendBar className="bg-[var(--sr-ink-muted)]">Deload</LegendBar>
            <LegendBar className="bg-[var(--sr-surface-alt)]">Missed</LegendBar>
          </div>
        </div>
      </div>
    </section>
  );
}

function LegendBar({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("w-4 h-[10px]", className)} aria-hidden />
      {children}
    </span>
  );
}

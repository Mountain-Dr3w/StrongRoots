import { Eyebrow } from "./Eyebrow";
import { cn } from "@/lib/cn";

type Lift = { name: string; from: number; to: number; unit: string };

export interface BlockReceiptData {
  clientInitial: string;
  programName: string;
  programNumber: string;
  dateRange: string;
  sessionsCompleted: number;
  sessionsProgrammed: number;
  loadDeltaPct: number;
  missedCount: number;
  missedNote: string;
  lifts: Lift[];
  /** 12 entries. "heavy" | "deload" | "missed" */
  weekIntensity: Array<"heavy" | "deload" | "missed">;
  coachNote: string;
}

export function BlockReceipt({ data }: { data: BlockReceiptData }) {
  const consistency = Math.round(
    ((data.sessionsCompleted) / data.sessionsProgrammed) * 100,
  );

  return (
    <div className="border border-[var(--sr-line-soft)] bg-[var(--sr-bg)]">
      {/* Header */}
      <div className="px-6 md:px-10 py-7 border-b border-[var(--sr-line-soft)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <Eyebrow>
              Block complete · {data.clientInitial}
            </Eyebrow>
            <span className="font-[var(--sr-font-display)] text-[36px] md:text-[44px] text-[var(--sr-ink)] leading-[var(--sr-lh-tight)] tracking-[-0.02em]">
              {data.programName}
            </span>
          </div>
          <div className="font-[var(--sr-font-mono)] text-[11px] text-[var(--sr-ink-muted)] flex flex-col items-end gap-1">
            <span>{data.dateRange}</span>
            <span>
              Program №{data.programNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Top-line stats */}
      <div className="grid grid-cols-3 divide-x divide-[var(--sr-line-soft)] border-b border-[var(--sr-line-soft)]">
        <ReceiptStat
          label="Sessions"
          value={`${data.sessionsCompleted} of ${data.sessionsProgrammed}`}
          sub={`${consistency}% consistency`}
        />
        <ReceiptStat
          label="Working load"
          value={`+${data.loadDeltaPct}%`}
          sub="vs. previous block"
        />
        <ReceiptStat
          label="Missed"
          value={String(data.missedCount)}
          sub={data.missedNote}
        />
      </div>

      {/* Lifts */}
      <div className="px-6 md:px-10 py-7 border-b border-[var(--sr-line-soft)]">
        <Eyebrow>Working-set progression</Eyebrow>
        <div className="mt-5 flex flex-col divide-y divide-[var(--sr-line-soft)]">
          {data.lifts.map((l) => {
            const delta = l.to - l.from;
            const pct = Math.round((delta / l.from) * 100);
            return (
              <div
                key={l.name}
                className="grid grid-cols-[1fr_auto] md:grid-cols-[1.4fr_0.9fr_0.7fr_0.5fr] items-baseline gap-4 py-4"
              >
                <span className="text-[var(--sr-ink)] text-[18px] md:text-[22px] font-[var(--sr-font-display)] leading-[var(--sr-lh-tight)]">
                  {l.name}
                </span>
                <span className="hidden md:inline font-[var(--sr-font-mono)] text-[14px] text-[var(--sr-ink-soft)]">
                  {l.from} → {l.to} {l.unit}
                </span>
                <span className="font-[var(--sr-font-mono)] text-[13px] md:text-[14px] text-[var(--sr-ink)] md:text-[var(--sr-ink)]">
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
      <div className="px-6 md:px-10 py-7 border-b border-[var(--sr-line-soft)]">
        <div className="flex items-baseline justify-between">
          <Eyebrow>Weeks 01 to 12</Eyebrow>
          <div className="flex gap-4 font-[var(--sr-font-mono)] text-[10px] text-[var(--sr-ink-muted)]">
            <LegendBar tone="heavy">Work</LegendBar>
            <LegendBar tone="deload">Deload</LegendBar>
            <LegendBar tone="missed">Missed</LegendBar>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-12 gap-[3px] md:gap-2">
          {data.weekIntensity.map((w, i) => (
            <div key={i} className="flex flex-col gap-2 items-center">
              <div
                className={cn(
                  "w-full h-[40px] md:h-[56px]",
                  w === "heavy" && "bg-[var(--sr-accent)]",
                  w === "deload" && "bg-[var(--sr-ink-muted)]",
                  w === "missed" && "bg-[var(--sr-surface-alt)]",
                )}
                aria-hidden
              />
              <span className="font-[var(--sr-font-mono)] text-[9px] md:text-[10px] text-[var(--sr-ink-muted)]">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Coach note */}
      <div className="px-6 md:px-10 py-7 flex flex-col gap-3">
        <Eyebrow>From Ashlyn</Eyebrow>
        <p className="text-[var(--sr-ink)] text-[17px] leading-[var(--sr-lh-relaxed)] max-w-2xl font-[var(--sr-font-display)] italic">
          {data.coachNote}
        </p>
      </div>
    </div>
  );
}

function ReceiptStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex flex-col gap-1 px-4 md:px-8 py-5 md:py-6">
      <Eyebrow className="text-[10px]">{label}</Eyebrow>
      <span className="font-[var(--sr-font-display)] text-[28px] md:text-[40px] text-[var(--sr-ink)] leading-none tracking-[-0.01em]">
        {value}
      </span>
      <span className="font-[var(--sr-font-mono)] text-[11px] text-[var(--sr-ink-muted)]">
        {sub}
      </span>
    </div>
  );
}

function LegendBar({
  tone,
  children,
}: {
  tone: "heavy" | "deload" | "missed";
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cn(
          "w-4 h-[10px]",
          tone === "heavy" && "bg-[var(--sr-accent)]",
          tone === "deload" && "bg-[var(--sr-ink-muted)]",
          tone === "missed" && "bg-[var(--sr-surface-alt)]",
        )}
        aria-hidden
      />
      {children}
    </span>
  );
}

import { Eyebrow } from "./Eyebrow";

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
}

export function BlockReceipt({ data }: { data: BlockReceiptData }) {
  const consistency = Math.round(
    (data.sessionsCompleted / data.sessionsProgrammed) * 100,
  );

  return (
    <div className="border border-[var(--sr-line-soft)] bg-[var(--sr-bg)]">
      {/* Header */}
      <div className="px-5 sm:px-8 md:px-10 py-6 md:py-7 border-b border-[var(--sr-line-soft)]">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Eyebrow>Block complete · {data.clientInitial}</Eyebrow>
            <span className="font-[var(--sr-font-display)] text-[32px] sm:text-[40px] md:text-[44px] text-[var(--sr-ink)] leading-[var(--sr-lh-tight)] tracking-[-0.02em]">
              {data.programName}
            </span>
          </div>
          <div className="font-[var(--sr-font-mono)] text-[11px] text-[var(--sr-ink-muted)] flex flex-col sm:items-end gap-1">
            <span>{data.dateRange}</span>
            <span>Program №{data.programNumber}</span>
          </div>
        </div>
      </div>

      {/* Top-line stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--sr-line-soft)] border-b border-[var(--sr-line-soft)]">
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
      <div className="px-5 sm:px-8 md:px-10 py-6 md:py-7">
        <Eyebrow>Working-set progression</Eyebrow>
        <div className="mt-4 flex flex-col divide-y divide-[var(--sr-line-soft)]">
          {data.lifts.map((l) => {
            const delta = l.to - l.from;
            const pct = Math.round((delta / l.from) * 100);
            return (
              <div
                key={l.name}
                className="grid grid-cols-[1fr_auto] md:grid-cols-[1.4fr_0.9fr_0.7fr_0.5fr] items-baseline gap-3 md:gap-4 py-4"
              >
                <span className="text-[var(--sr-ink)] text-[17px] sm:text-[19px] md:text-[22px] font-[var(--sr-font-display)] leading-[var(--sr-lh-tight)]">
                  {l.name}
                </span>
                <span className="hidden md:inline font-[var(--sr-font-mono)] text-[14px] text-[var(--sr-ink-soft)]">
                  {l.from} to {l.to} {l.unit}
                </span>
                <span className="font-[var(--sr-font-mono)] text-[13px] md:text-[14px] text-[var(--sr-ink)] text-right md:text-left">
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
    <div className="flex flex-col gap-1 px-5 sm:px-6 md:px-8 py-5 md:py-6">
      <Eyebrow className="text-[10px]">{label}</Eyebrow>
      <span className="font-[var(--sr-font-display)] text-[30px] md:text-[40px] text-[var(--sr-ink)] leading-none tracking-[-0.01em]">
        {value}
      </span>
      <span className="font-[var(--sr-font-mono)] text-[11px] text-[var(--sr-ink-muted)]">
        {sub}
      </span>
    </div>
  );
}

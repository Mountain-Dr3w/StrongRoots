import { Eyebrow } from "./Eyebrow";

export type SessionRow = {
  slot: string;
  exercise: string;
  scheme: string;
  load: string;
  rpe: string | null;
  notes?: string;
};

export interface SessionLogData {
  dayLabel: string;
  blockLabel: string;
  sessionTitle: string;
  durationMinutes: number;
  rows: SessionRow[];
  coachNote: string;
}

export function SessionLog({ data }: { data: SessionLogData }) {
  return (
    <div className="border border-[var(--sr-line-soft)] bg-[var(--sr-surface)] rounded-[var(--sr-radius-md)] overflow-hidden">
      {/* header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 px-6 md:px-8 py-5 border-b border-[var(--sr-line-soft)]">
        <div className="flex flex-col gap-1">
          <Eyebrow>
            {data.dayLabel} · {data.blockLabel}
          </Eyebrow>
          <span className="font-[var(--sr-font-display)] text-[26px] text-[var(--sr-ink)] leading-[var(--sr-lh-tight)]">
            {data.sessionTitle}
          </span>
        </div>
        <span className="font-[var(--sr-font-mono)] text-[12px] text-[var(--sr-ink-soft)]">
          {data.durationMinutes} min
        </span>
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
        {data.rows.map((r) => (
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
          {data.coachNote}
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/site/Eyebrow";
import { createBookingAction } from "./actions";

interface Props {
  offeringId: string;
  requiresIntake: boolean;
  slots: string[];
}

function groupByDate(isoSlots: string[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const iso of isoSlots) {
    const date = iso.slice(0, 10);
    (out[date] ||= []).push(iso);
  }
  return out;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function BookingForm({ offeringId, requiresIntake, slots }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const grouped = groupByDate(slots);

  return (
    <form action={createBookingAction} className="flex flex-col gap-8">
      <input type="hidden" name="offeringId" value={offeringId} />
      <input type="hidden" name="startAt" value={selected ?? ""} />

      <div className="flex flex-col gap-6">
        <Eyebrow>Pick a time · next 7 days</Eyebrow>
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([date, isos]) => (
            <div
              key={date}
              className="flex flex-col gap-3 pb-5 border-b border-[var(--sr-line-soft)] last:border-b-0"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-[var(--sr-font-display)] text-[22px] text-[var(--sr-ink)]">
                  {formatDate(date)}
                </span>
                <span className="font-[var(--sr-font-mono)] text-[11px] text-[var(--sr-ink-muted)]">
                  {isos.length} open
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {isos.map((iso) => {
                  const isSelected = selected === iso;
                  return (
                    <button
                      type="button"
                      key={iso}
                      onClick={() => setSelected(iso)}
                      className={cn(
                        "px-4 h-10 font-[var(--sr-font-mono)] text-[13px]",
                        "rounded-[var(--sr-radius-md)] border transition-colors",
                        isSelected
                          ? "bg-[var(--sr-accent)] text-[var(--sr-accent-ink)] border-[var(--sr-accent)]"
                          : "bg-transparent text-[var(--sr-ink)] border-[var(--sr-line)] hover:border-[var(--sr-ink)]",
                      )}
                    >
                      {formatTime(iso)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {requiresIntake ? (
        <div className="flex flex-col gap-6 pt-6 border-t border-[var(--sr-line-soft)]">
          <Eyebrow>Tell Ashlyn about you</Eyebrow>
          <Input
            name="intake_goals"
            label="Goals"
            required
            placeholder="What do you want out of this?"
          />
          <Input
            name="intake_injuries"
            label="Injuries"
            placeholder="None, or describe"
          />
        </div>
      ) : null}

      <div className="pt-6 border-t border-[var(--sr-line-soft)] flex justify-end">
        <Button type="submit" variant="primary" size="lg" disabled={!selected}>
          Confirm booking
        </Button>
      </div>
    </form>
  );
}

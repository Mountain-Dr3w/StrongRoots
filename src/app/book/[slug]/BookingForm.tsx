"use client";

import { useState } from "react";

import { Button } from "@/components/Button";
import { Card, CardBody, CardTitle } from "@/components/Card";
import { Input } from "@/components/Input";
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
    <form action={createBookingAction} className="flex flex-col gap-[var(--space-4)]">
      <input type="hidden" name="offeringId" value={offeringId} />
      <input type="hidden" name="startAt" value={selected ?? ""} />

      <Card>
        <CardTitle>Pick a time</CardTitle>
        <CardBody className="flex flex-col gap-[var(--space-4)]">
          {Object.entries(grouped).map(([date, isos]) => (
            <div key={date} className="flex flex-col gap-[var(--space-2)]">
              <div className="font-medium">{formatDate(date)}</div>
              <div className="flex flex-wrap gap-[var(--space-2)]">
                {isos.map((iso) => {
                  const isSelected = selected === iso;
                  return (
                    <button
                      type="button"
                      key={iso}
                      onClick={() => setSelected(iso)}
                      className={
                        isSelected
                          ? "px-[var(--space-3)] h-8 rounded-[var(--radius-sm)] bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                          : "px-[var(--space-3)] h-8 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-fg)] hover:border-[var(--color-accent)]"
                      }
                    >
                      {formatTime(iso)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {requiresIntake ? (
        <Card>
          <CardTitle>Tell Ashlyn about you</CardTitle>
          <CardBody className="flex flex-col gap-[var(--space-3)]">
            <label className="flex flex-col gap-[var(--space-1)]">
              <span className="text-[var(--font-size-sm)] text-[var(--color-muted)]">Goals</span>
              <Input name="intake_goals" required placeholder="What do you want out of this?" />
            </label>
            <label className="flex flex-col gap-[var(--space-1)]">
              <span className="text-[var(--font-size-sm)] text-[var(--color-muted)]">Injuries</span>
              <Input name="intake_injuries" placeholder="None, or describe" />
            </label>
          </CardBody>
        </Card>
      ) : null}

      <Button type="submit" variant="primary" size="lg" disabled={!selected}>
        Confirm booking
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      {items.map((item, idx) => {
        const open = openIdx === idx;
        return (
          <div
            key={idx}
            className="border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-surface)]"
          >
            <button
              type="button"
              onClick={() => setOpenIdx(open ? null : idx)}
              className="w-full flex items-center justify-between px-[var(--space-4)] py-[var(--space-3)] text-left"
              aria-expanded={open}
            >
              <span className="font-medium">{item.question}</span>
              <span className={cn("transition", open ? "rotate-45" : "")} aria-hidden>
                +
              </span>
            </button>
            {open ? (
              <div className="px-[var(--space-4)] pb-[var(--space-4)] text-[var(--color-muted)]">
                {item.answer}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

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
    <div className="flex flex-col border-t border-[var(--sr-line-soft)]">
      {items.map((item, idx) => {
        const open = openIdx === idx;
        return (
          <div
            key={idx}
            className="border-b border-[var(--sr-line-soft)]"
          >
            <button
              type="button"
              onClick={() => setOpenIdx(open ? null : idx)}
              className={cn(
                "w-full flex items-center justify-between gap-6 py-5 text-left",
                "font-[var(--sr-font-display)] text-[22px] leading-[var(--sr-lh-snug)]",
                "text-[var(--sr-ink)] transition-colors",
                "hover:text-[var(--sr-ink-soft)]",
              )}
              aria-expanded={open}
            >
              <span>{item.question}</span>
              <span
                className={cn(
                  "shrink-0 font-[var(--sr-font-mono)] text-[18px] text-[var(--sr-ink-muted)]",
                  "transition-transform duration-[var(--sr-dur-quick)]",
                  open ? "rotate-45" : "",
                )}
                aria-hidden
              >
                +
              </span>
            </button>
            {open ? (
              <div className="pb-6 pr-10 text-[var(--sr-ink-soft)] text-[15px] leading-[var(--sr-lh-relaxed)]">
                {item.answer}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

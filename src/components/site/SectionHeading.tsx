import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { Eyebrow } from "./Eyebrow";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  className,
  size = "md",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const titleSize =
    size === "lg"
      ? "text-[56px] md:text-[72px]"
      : size === "sm"
        ? "text-[36px] md:text-[40px]"
        : "text-[44px] md:text-[56px]";

  return (
    <header
      className={cn(
        "flex items-end justify-between flex-wrap gap-6 pb-5 border-b border-[var(--sr-line)]",
        className,
      )}
    >
      <div className="flex flex-col gap-2 max-w-3xl">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2
          className={cn(
            "font-[var(--sr-font-display)] font-normal text-[var(--sr-ink)]",
            "leading-[var(--sr-lh-tight)] tracking-[-0.02em]",
            titleSize,
          )}
        >
          {title}
        </h2>
        {subtitle ? (
          <p className="text-[var(--sr-ink-soft)] text-[var(--sr-text-lead)] leading-[var(--sr-lh-normal)] mt-2 max-w-xl">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className="flex items-center gap-3">{action}</div> : null}
    </header>
  );
}

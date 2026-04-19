import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Eyebrow({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "font-[var(--sr-font-label)] text-[11px] uppercase",
        "tracking-[var(--sr-label-tracking)] text-[var(--sr-ink-muted)]",
        className,
      )}
      {...rest}
    />
  );
}

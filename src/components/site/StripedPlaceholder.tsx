import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

export function StripedPlaceholder({
  label,
  className,
  style,
  aspect = "3/4",
}: {
  label?: string;
  className?: string;
  style?: CSSProperties;
  aspect?: string | false;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-[var(--sr-surface-alt)]",
        "rounded-[2px]",
        className,
      )}
      style={{
        aspectRatio: aspect === false ? undefined : aspect,
        backgroundImage: `repeating-linear-gradient(135deg, var(--sr-surface-alt) 0 14px, var(--sr-line-soft) 14px 28px)`,
        ...style,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 40%, color-mix(in oklab, var(--sr-ink) 20%, transparent))",
        }}
        aria-hidden
      />
      {label ? (
        <div
          className="absolute left-3 bottom-3 px-2 py-[2px] font-[var(--sr-font-mono)] text-[10px] text-[var(--sr-bg)] bg-[var(--sr-ink)]"
          aria-hidden
        >
          {label}
        </div>
      ) : null}
    </div>
  );
}

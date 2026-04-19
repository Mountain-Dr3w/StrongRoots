import Image from "next/image";
import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

export function StripedPlaceholder({
  label,
  src,
  alt,
  className,
  style,
  aspect = "3/4",
  priority,
}: {
  label?: string;
  src?: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  aspect?: string | false;
  priority?: boolean;
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
        backgroundImage: src
          ? undefined
          : `repeating-linear-gradient(135deg, var(--sr-surface-alt) 0 14px, var(--sr-line-soft) 14px 28px)`,
        ...style,
      }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? label ?? ""}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
          priority={priority}
        />
      ) : null}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 40%, color-mix(in oklab, var(--sr-ink) 25%, transparent))",
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

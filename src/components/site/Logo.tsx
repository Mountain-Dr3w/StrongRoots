import { cn } from "@/lib/cn";

type LogoTone = "light" | "dark";

export function Logo({
  tone = "light",
  height = 32,
  className,
}: {
  // Kept for API compatibility. Ignored — the logo is wordmark-only now.
  variant?: "horizontal" | "mark";
  tone?: LogoTone;
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-block font-[var(--sr-font-display)] leading-none tracking-[-0.005em] select-none",
        tone === "dark" ? "text-[var(--sr-bg)]" : "text-[var(--sr-ink)]",
        className,
      )}
      style={{ fontSize: `${height}px` }}
    >
      Strong Roots
    </span>
  );
}

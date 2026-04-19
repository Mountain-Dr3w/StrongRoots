import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = "text", ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-10 w-full px-3 rounded-[var(--radius-md)]",
        "bg-[var(--color-surface)] text-[var(--color-fg)]",
        "border border-[var(--color-border)]",
        "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]",
        "placeholder:text-[var(--color-muted)]",
        "disabled:opacity-50",
        className,
      )}
      {...rest}
    />
  );
});

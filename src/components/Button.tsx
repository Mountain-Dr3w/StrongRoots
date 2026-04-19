import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-[var(--color-primary)] text-[var(--color-primary-fg)] hover:opacity-90",
  accent: "bg-[var(--color-accent)] text-[var(--color-accent-fg)] hover:opacity-90",
  ghost:
    "bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-surface)] border border-[var(--color-border)]",
  danger: "bg-[var(--color-danger)] text-[var(--color-danger-fg)] hover:opacity-90",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-3 text-[var(--font-size-sm)] rounded-[var(--radius-sm)]",
  md: "h-10 px-4 text-[var(--font-size-base)] rounded-[var(--radius-md)]",
  lg: "h-12 px-6 text-[var(--font-size-lg)] rounded-[var(--radius-lg)]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center font-medium transition disabled:opacity-50 disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...rest}
    />
  );
});

import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "tertiary" | "ghost" | "accent" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-[10px] " +
  "font-[var(--sr-font-label)] tracking-[0.06em] " +
  "transition-[transform,box-shadow,background-color,opacity] duration-[var(--sr-dur-quick)] " +
  "ease-[var(--sr-ease-out)] cursor-pointer select-none " +
  "disabled:cursor-not-allowed disabled:bg-[var(--sr-line)] disabled:text-[var(--sr-ink-muted)] " +
  "disabled:shadow-none disabled:translate-y-0 disabled:border-[var(--sr-line)]";

const filledHover =
  "hover:-translate-y-px hover:shadow-[var(--sr-shadow-rest)] active:translate-y-px active:opacity-90";

const variants: Record<Variant, string> = {
  primary: `bg-[var(--sr-accent)] text-[var(--sr-accent-ink)] border border-transparent font-semibold ${filledHover}`,
  accent: `bg-[var(--sr-accent)] text-[var(--sr-accent-ink)] border border-transparent font-semibold ${filledHover}`,
  secondary:
    "bg-transparent text-[var(--sr-ink)] border border-[var(--sr-ink)] font-medium hover:bg-[var(--sr-surface-alt)]",
  ghost:
    "bg-transparent text-[var(--sr-ink)] border border-[var(--sr-ink)] font-medium hover:bg-[var(--sr-surface-alt)]",
  tertiary:
    "bg-transparent text-[var(--sr-ink)] border-0 border-b border-[var(--sr-ink)] rounded-none font-medium hover:text-[var(--sr-ink-soft)]",
  danger: `bg-[var(--sr-error)] text-[var(--sr-accent-ink)] border border-transparent font-semibold ${filledHover}`,
};

const sizes: Record<Size, string> = {
  sm: "text-[12px] px-[18px] py-[10px] rounded-[var(--sr-radius-md)]",
  md: "text-[13px] px-[26px] py-[14px] rounded-[var(--sr-radius-md)]",
  lg: "text-[15px] px-[32px] py-[18px] rounded-[var(--sr-radius-md)]",
};

const tertiarySizes: Record<Size, string> = {
  sm: "text-[12px] px-1 py-[10px]",
  md: "text-[13px] px-1 py-[14px]",
  lg: "text-[15px] px-1 py-[18px]",
};

const arrowDefault: Record<Variant, boolean> = {
  primary: true,
  accent: true,
  tertiary: true,
  secondary: false,
  ghost: false,
  danger: false,
};

function ArrowGlyph({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M1 7h12M8 2l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", type = "button", arrow, children, ...rest },
  ref,
) {
  const showArrow = arrow ?? arrowDefault[variant];
  const sizeClasses = variant === "tertiary" ? tertiarySizes[size] : sizes[size];
  return (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], sizeClasses, className)}
      {...rest}
    >
      {children}
      {showArrow ? <ArrowGlyph size={12} /> : null}
    </button>
  );
});

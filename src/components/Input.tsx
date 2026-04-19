import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: ReactNode;
  hint?: ReactNode;
}

const fieldBase =
  "w-full px-4 py-[14px] rounded-[var(--sr-radius-md)] bg-transparent " +
  "font-[var(--sr-font-body)] text-[var(--sr-text-body)] text-[var(--sr-ink)] " +
  "border outline-none transition-colors duration-[var(--sr-dur-quick)] " +
  "placeholder:text-[var(--sr-ink-muted)] disabled:opacity-50 disabled:cursor-not-allowed";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = "text", label, error, hint, id, ...rest },
  ref,
) {
  const reactId = useId();
  const fieldId = id ?? reactId;
  const hasLabel = label != null;
  const hasFooter = error != null || hint != null;

  const field = (
    <input
      ref={ref}
      id={fieldId}
      type={type}
      aria-invalid={error ? true : undefined}
      className={cn(
        fieldBase,
        error
          ? "border-[var(--sr-error)] focus:border-[var(--sr-error)]"
          : "border-[var(--sr-line)] focus:border-[var(--sr-accent)] focus:border-2 focus:px-[15px] focus:py-[13px]",
        className,
      )}
      {...rest}
    />
  );

  if (!hasLabel && !hasFooter) return field;

  return (
    <div className="flex flex-col">
      {hasLabel ? (
        <label
          htmlFor={fieldId}
          className="mb-2 font-[var(--sr-font-label)] text-[10px] uppercase tracking-[var(--sr-label-tracking)] text-[var(--sr-ink-soft)]"
        >
          {label}
        </label>
      ) : null}
      {field}
      {error ? (
        <div className="mt-[6px] text-[12px] text-[var(--sr-error)]">{error}</div>
      ) : hint ? (
        <div className="mt-[6px] text-[12px] text-[var(--sr-ink-muted)]">{hint}</div>
      ) : null}
    </div>
  );
});

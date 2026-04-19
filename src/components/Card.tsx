import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-[var(--sr-surface)] text-[var(--sr-ink)]",
        "border border-[var(--sr-line-soft)]",
        "rounded-[var(--sr-radius-md)] overflow-hidden",
        className,
      )}
      {...rest}
    />
  );
});

export const CardImage = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardImage({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "aspect-[16/9] w-full bg-[var(--sr-surface-alt)]",
          "border-b border-[var(--sr-line-soft)] overflow-hidden",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export const CardBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardBody({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn("p-[24px] text-[var(--sr-ink)]", className)}
        {...rest}
      />
    );
  },
);

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, ...rest }, ref) {
    return (
      <h3
        ref={ref}
        className={cn(
          "font-[var(--sr-font-display)] font-normal",
          "text-[30px] leading-[var(--sr-lh-snug)] mb-3",
          "text-[var(--sr-ink)]",
          className,
        )}
        {...rest}
      />
    );
  },
);

"use client";

import { forwardRef, useEffect, useRef } from "react";
import type { DialogHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface DialogProps extends DialogHTMLAttributes<HTMLDialogElement> {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(function Dialog(
  { open, onClose, className, children, ...rest },
  ref,
) {
  const innerRef = useRef<HTMLDialogElement | null>(null);
  const setRefs = (node: HTMLDialogElement | null) => {
    innerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLDialogElement | null>).current = node;
  };

  useEffect(() => {
    const dlg = innerRef.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  return (
    <dialog
      ref={setRefs}
      onClose={onClose}
      className={cn(
        "backdrop:bg-black/50 backdrop:backdrop-blur-[2px]",
        "bg-[var(--sr-surface)] text-[var(--sr-ink)]",
        "border border-[var(--sr-line-soft)]",
        "rounded-[var(--sr-radius-md)] p-8",
        "shadow-[var(--sr-shadow-lift)]",
        "max-w-lg w-full",
        className,
      )}
      {...rest}
    >
      {children}
    </dialog>
  );
});

import Link from "next/link";

import { Logo } from "./Logo";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--sr-line-soft)] bg-[var(--sr-bg)]">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 flex flex-col md:flex-row gap-10 md:gap-16 justify-between">
        <div className="flex flex-col gap-5 max-w-sm">
          <Logo variant="horizontal" tone="light" height={32} />
          <p className="text-[var(--sr-ink-soft)] text-[15px] leading-[var(--sr-lh-normal)]">
            Training for the long arc. Programs, consulting, and nutrition practice from Ashlyn.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-[14px]">
          <div className="flex flex-col gap-3">
            <div className="font-[var(--sr-font-label)] text-[10px] uppercase tracking-[var(--sr-label-tracking)] text-[var(--sr-ink-muted)]">
              Train
            </div>
            <Link href="/shop?type=plan" className="text-[var(--sr-ink-soft)] hover:text-[var(--sr-ink)]">
              Programs
            </Link>
            <Link href="/shop?type=consulting" className="text-[var(--sr-ink-soft)] hover:text-[var(--sr-ink)]">
              Consulting
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <div className="font-[var(--sr-font-label)] text-[10px] uppercase tracking-[var(--sr-label-tracking)] text-[var(--sr-ink-muted)]">
              Practice
            </div>
            <Link href="/about" className="text-[var(--sr-ink-soft)] hover:text-[var(--sr-ink)]">
              About
            </Link>
            <Link href="/contact" className="text-[var(--sr-ink-soft)] hover:text-[var(--sr-ink)]">
              Contact
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <div className="font-[var(--sr-font-label)] text-[10px] uppercase tracking-[var(--sr-label-tracking)] text-[var(--sr-ink-muted)]">
              Account
            </div>
            <Link href="/signin" className="text-[var(--sr-ink-soft)] hover:text-[var(--sr-ink)]">
              Sign in
            </Link>
            <Link href="/account/library" className="text-[var(--sr-ink-soft)] hover:text-[var(--sr-ink)]">
              Library
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--sr-line-soft)]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 flex items-center justify-between font-[var(--sr-font-mono)] text-[11px] text-[var(--sr-ink-muted)]">
          <span>© {year} Strong Roots</span>
          <span>Made for the long arc.</span>
        </div>
      </div>
    </footer>
  );
}

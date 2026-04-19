import Link from "next/link";
import type { ReactNode } from "react";

import { auth, signOut } from "@/auth";
import { Button } from "@/components/Button";
import { Logo } from "@/components/site/Logo";

const tabs = [
  { href: "/account/library", label: "Library" },
  { href: "/account/bookings", label: "Bookings" },
  { href: "/account/profile", label: "Profile" },
];

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--sr-bg)] text-[var(--sr-ink)]">
      <header className="border-b border-[var(--sr-line-soft)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-6 px-6 md:px-10 pt-5 pb-4">
          <Link href="/" aria-label="Home">
            <Logo variant="horizontal" tone="light" height={22} />
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button type="submit" variant="secondary" size="sm" arrow={false}>
              Sign out
            </Button>
          </form>
        </div>
        <nav className="max-w-5xl mx-auto px-6 md:px-10 flex gap-8 overflow-x-auto">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="py-3 font-[var(--sr-font-label)] text-[11px] uppercase tracking-[var(--sr-label-tracking)] text-[var(--sr-ink-soft)] hover:text-[var(--sr-ink)] border-b-2 border-transparent hover:border-[var(--sr-ink)] transition-colors whitespace-nowrap"
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}

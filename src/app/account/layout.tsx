import Link from "next/link";
import type { ReactNode } from "react";

import { auth, signOut } from "@/auth";
import { Button } from "@/components/Button";

const tabs = [
  { href: "/account/library", label: "Library" },
  { href: "/account/bookings", label: "Bookings" },
  { href: "/account/profile", label: "Profile" },
];

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-[var(--space-6)] py-[var(--space-3)]">
          <Link href="/" className="font-semibold">StrongRoots</Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button type="submit" variant="ghost" size="sm">Sign out</Button>
          </form>
        </div>
        <div className="max-w-5xl mx-auto px-[var(--space-6)] flex gap-[var(--space-1)]">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="px-[var(--space-3)] py-[var(--space-2)] text-[var(--font-size-sm)] border-b-2 border-transparent hover:border-[var(--color-accent)]"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}

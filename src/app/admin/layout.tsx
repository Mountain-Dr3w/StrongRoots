import Link from "next/link";
import type { ReactNode } from "react";

import { auth, signOut } from "@/auth";
import { Button } from "@/components/Button";

const tabs = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/availability", label: "Availability" },
  { href: "/admin/customers", label: "Customers" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-[var(--space-6)] py-[var(--space-3)]">
          <Link href="/admin" className="font-semibold">StrongRoots admin</Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button type="submit" variant="ghost" size="sm">Sign out</Button>
          </form>
        </div>
        <div className="max-w-6xl mx-auto px-[var(--space-6)] flex gap-[var(--space-1)] overflow-x-auto">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="px-[var(--space-3)] py-[var(--space-2)] text-[var(--font-size-sm)] whitespace-nowrap border-b-2 border-transparent hover:border-[var(--color-accent)]"
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

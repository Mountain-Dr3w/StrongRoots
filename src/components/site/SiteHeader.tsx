import Link from "next/link";

import { auth, signOut } from "@/auth";
import { Button } from "@/components/Button";
import { Logo } from "./Logo";

const nav: Array<{ href: string; label: string }> = [
  { href: "/shop?type=plan", label: "Programs" },
  { href: "/shop?type=consulting", label: "Consulting" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="border-b border-[var(--sr-line-soft)] bg-[var(--sr-bg)] sticky top-0 z-30 backdrop-blur-sm px-6 md:px-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6 py-5">
        <Link href="/" aria-label="StrongRoots home" className="shrink-0">
          <Logo tone="light" height={24} priority />
        </Link>

        <nav className="hidden md:flex gap-8 font-[var(--sr-font-label)] text-[11px] uppercase tracking-[var(--sr-label-tracking)] text-[var(--sr-ink-soft)]">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-[var(--sr-ink)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {session ? (
          <div className="flex items-center gap-3">
            <Link
              href="/account/library"
              className="hidden sm:inline font-[var(--sr-font-label)] text-[11px] uppercase tracking-[var(--sr-label-tracking)] text-[var(--sr-ink-soft)] hover:text-[var(--sr-ink)]"
            >
              Account
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button type="submit" variant="secondary" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        ) : (
          <Link href="/signin">
            <Button variant="secondary" size="sm" arrow={false}>
              Sign in
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}

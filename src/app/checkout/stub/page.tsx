import Link from "next/link";

import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/site/Eyebrow";
import { Logo } from "@/components/site/Logo";

export default function CheckoutStubPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-[var(--sr-bg)]">
      <div className="max-w-md flex flex-col gap-8 items-start">
        <Logo tone="light" height={20} />
        <div className="flex flex-col gap-4">
          <Eyebrow>Checkout · dev stub</Eyebrow>
          <h1 className="font-[var(--sr-font-display)] font-normal text-[var(--sr-ink)] text-[40px] leading-[var(--sr-lh-tight)] tracking-[-0.02em]">
            Stripe isn't wired up.
          </h1>
          <p className="text-[var(--sr-ink-soft)] leading-[var(--sr-lh-normal)]">
            No <code className="font-[var(--sr-font-mono)] text-[13px]">STRIPE_SECRET_KEY</code>{" "}
            configured, so checkout is stubbed. Set a test-mode key in{" "}
            <code className="font-[var(--sr-font-mono)] text-[13px]">.env.local</code> to
            exercise the real flow.
          </p>
        </div>
        <Link href="/shop">
          <Button variant="secondary" size="md" arrow={false}>
            Back to shop
          </Button>
        </Link>
      </div>
    </main>
  );
}

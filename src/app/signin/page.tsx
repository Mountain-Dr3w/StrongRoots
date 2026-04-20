import Link from "next/link";

import { signIn } from "@/auth";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Eyebrow } from "@/components/site/Eyebrow";
import { Logo } from "@/components/site/Logo";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-[var(--sr-bg)]">
      <div className="w-full max-w-md flex flex-col gap-10">
        <Link href="/" aria-label="Home" className="self-start">
          <Logo tone="light" height={20} priority />
        </Link>

        <div className="flex flex-col gap-4">
          <Eyebrow>Account access</Eyebrow>
          <h1 className="font-[var(--sr-font-display)] font-normal text-[var(--sr-ink)] text-[48px] leading-[var(--sr-lh-tight)] tracking-[-0.02em]">
            Welcome back.
          </h1>
          <p className="text-[var(--sr-ink-soft)] leading-[var(--sr-lh-normal)]">
            Enter your email. We'll send you a magic link. No password to remember.
          </p>
        </div>

        <form
          action={async (formData) => {
            "use server";
            const email = formData.get("email") as string;
            await signIn("resend", { email, redirectTo: "/account" });
          }}
          className="flex flex-col gap-4"
        >
          <Input
            id="email"
            name="email"
            type="email"
            required
            label="Email"
            placeholder="you@example.com"
          />
          <Button type="submit" variant="primary" size="lg">
            Send magic link
          </Button>
        </form>

        <div className="relative flex items-center gap-4 text-[var(--sr-ink-muted)]">
          <div className="flex-1 border-t border-[var(--sr-line-soft)]" />
          <span className="font-[var(--sr-font-label)] text-[10px] uppercase tracking-[var(--sr-label-tracking)]">
            or
          </span>
          <div className="flex-1 border-t border-[var(--sr-line-soft)]" />
        </div>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/account" });
          }}
        >
          <Button type="submit" variant="secondary" className="w-full" size="lg" arrow={false}>
            Continue with Google
          </Button>
        </form>

        <p className="font-[var(--sr-font-mono)] text-[11px] text-[var(--sr-ink-muted)] text-center">
          By signing in you agree to the practice norms.{" "}
          <Link href="/about" className="underline underline-offset-4 hover:text-[var(--sr-ink)]">
            Read more
          </Link>
          .
        </p>
      </div>
    </main>
  );
}

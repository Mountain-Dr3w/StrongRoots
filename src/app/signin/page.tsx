import { signIn } from "@/auth";
import { Button } from "@/components/Button";
import { Card, CardTitle, CardBody } from "@/components/Card";
import { Input } from "@/components/Input";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-[var(--space-6)]">
      <Card className="w-full max-w-md">
        <CardTitle>Sign in</CardTitle>
        <CardBody className="flex flex-col gap-[var(--space-4)]">
          <form
            action={async (formData) => {
              "use server";
              const email = formData.get("email") as string;
              await signIn("resend", { email, redirectTo: "/account" });
            }}
            className="flex flex-col gap-[var(--space-2)]"
          >
            <label htmlFor="email" className="text-[var(--font-size-sm)] text-[var(--color-muted)]">
              Email — we'll send you a magic link
            </label>
            <Input id="email" name="email" type="email" required placeholder="you@example.com" />
            <Button type="submit" variant="primary">
              Send magic link
            </Button>
          </form>

          <div className="border-t border-[var(--color-border)] pt-[var(--space-4)]">
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/account" });
              }}
            >
              <Button type="submit" variant="ghost" className="w-full">
                Continue with Google
              </Button>
            </form>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}

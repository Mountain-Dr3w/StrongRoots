import { auth, signOut } from "@/auth";
import { Button } from "@/components/Button";
import { Card, CardTitle, CardBody } from "@/components/Card";

export default async function AccountPage() {
  const session = await auth();
  if (!session) return null;

  return (
    <main className="flex min-h-screen items-center justify-center p-[var(--space-6)]">
      <Card className="w-full max-w-md">
        <CardTitle>Your account</CardTitle>
        <CardBody className="flex flex-col gap-[var(--space-3)]">
          <div>
            <div className="text-[var(--color-muted)] text-[var(--font-size-sm)]">Email</div>
            <div>{session.user.email}</div>
          </div>
          <div>
            <div className="text-[var(--color-muted)] text-[var(--font-size-sm)]">Role</div>
            <div>{session.user.role}</div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button type="submit" variant="ghost" className="w-full">
              Sign out
            </Button>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}

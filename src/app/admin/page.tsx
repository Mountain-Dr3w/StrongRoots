import { auth } from "@/auth";
import { Card, CardTitle, CardBody } from "@/components/Card";

export default async function AdminPage() {
  const session = await auth();
  if (!session) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-[var(--space-6)]">
      <Card className="w-full max-w-2xl">
        <CardTitle>Admin</CardTitle>
        <CardBody>
          <p>Signed in as <strong>{session.user.email}</strong> (role: {session.user.role}).</p>
          <p className="text-[var(--color-muted)] mt-[var(--space-3)]">
            Full dashboard lands in BD-010.
          </p>
        </CardBody>
      </Card>
    </main>
  );
}

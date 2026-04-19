import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db, schema } from "@/db";
import { Button } from "@/components/Button";
import { Card, CardBody, CardTitle } from "@/components/Card";
import { Input } from "@/components/Input";
import { updateProfileAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProfileTab() {
  const session = await auth();
  if (!session) return null;

  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, session.user.id),
  });
  if (!user) return null;

  return (
    <main className="max-w-2xl mx-auto p-[var(--space-6)] flex flex-col gap-[var(--space-6)]">
      <h1 className="text-[var(--font-size-2xl)] font-semibold">Profile</h1>

      <Card>
        <CardTitle>Your details</CardTitle>
        <CardBody>
          <form action={updateProfileAction} className="flex flex-col gap-[var(--space-3)]">
            <label className="flex flex-col gap-[var(--space-1)]">
              <span className="text-[var(--font-size-sm)] text-[var(--color-muted)]">Email</span>
              <Input value={user.email} disabled />
            </label>
            <label className="flex flex-col gap-[var(--space-1)]">
              <span className="text-[var(--font-size-sm)] text-[var(--color-muted)]">Name</span>
              <Input name="name" defaultValue={user.name ?? ""} placeholder="Your name" />
            </label>
            <label className="flex flex-col gap-[var(--space-1)]">
              <span className="text-[var(--font-size-sm)] text-[var(--color-muted)]">Timezone</span>
              <Input name="timezone" defaultValue={user.timezone} placeholder="America/New_York" />
            </label>
            <Button type="submit" variant="primary">Save</Button>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}

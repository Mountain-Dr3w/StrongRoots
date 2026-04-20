import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db, schema } from "@/db";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Eyebrow } from "@/components/site/Eyebrow";
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
    <main className="max-w-2xl mx-auto px-6 md:px-10 py-12 md:py-16 flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <Eyebrow>Your details</Eyebrow>
        <h1 className="font-[var(--sr-font-display)] font-normal text-[var(--sr-ink)] text-[48px] md:text-[56px] leading-[var(--sr-lh-tight)] tracking-[-0.02em]">
          Profile.
        </h1>
        <p className="text-[var(--sr-ink-soft)] leading-[var(--sr-lh-normal)] max-w-lg">
          Kept minimal on purpose. Email is fixed. Update name and timezone below.
        </p>
      </header>

      <form
        action={updateProfileAction}
        className="flex flex-col gap-6 pt-6 border-t border-[var(--sr-line-soft)]"
      >
        <Input value={user.email} disabled label="Email" />
        <Input
          name="name"
          defaultValue={user.name ?? ""}
          placeholder="Your name"
          label="Name"
        />
        <Input
          name="timezone"
          defaultValue={user.timezone}
          placeholder="America/New_York"
          label="Timezone"
          hint="IANA tz. Used for booking times and reminders."
        />
        <div className="pt-4 flex justify-end border-t border-[var(--sr-line-soft)]">
          <Button type="submit" variant="primary" arrow={false}>
            Save changes
          </Button>
        </div>
      </form>
    </main>
  );
}

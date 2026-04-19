"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db, schema } from "@/db";

export async function updateProfileAction(formData: FormData) {
  const session = await auth();
  if (!session) return;

  const name = (formData.get("name") as string | null)?.trim() || null;
  const timezone = (formData.get("timezone") as string | null)?.trim() || "UTC";

  await db
    .update(schema.users)
    .set({ name, timezone, updatedAt: new Date() })
    .where(eq(schema.users.id, session.user.id));

  revalidatePath("/account/profile");
}

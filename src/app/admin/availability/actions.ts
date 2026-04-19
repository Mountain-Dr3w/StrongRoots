"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { db, schema } from "@/db";

export async function addRuleAction(formData: FormData) {
  const dayOfWeek = Number(formData.get("dayOfWeek"));
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const timezone = formData.get("timezone") as string;

  await db.insert(schema.availabilityRules).values({
    dayOfWeek,
    startTime,
    endTime,
    timezone,
  });
  revalidatePath("/admin/availability");
}

export async function deleteRuleAction(formData: FormData) {
  const id = formData.get("id") as string;
  await db.delete(schema.availabilityRules).where(eq(schema.availabilityRules.id, id));
  revalidatePath("/admin/availability");
}

export async function addExceptionAction(formData: FormData) {
  const date = formData.get("date") as string;
  const note = ((formData.get("note") as string) ?? "").trim() || null;
  const blocked = formData.get("blocked") === "on";

  await db.insert(schema.availabilityExceptions).values({
    date,
    note,
    blocked,
  });
  revalidatePath("/admin/availability");
}

export async function deleteExceptionAction(formData: FormData) {
  const id = formData.get("id") as string;
  await db.delete(schema.availabilityExceptions).where(eq(schema.availabilityExceptions.id, id));
  revalidatePath("/admin/availability");
}

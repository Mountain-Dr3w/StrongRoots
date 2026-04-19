"use server";

import { revalidatePath } from "next/cache";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { asc, eq } from "drizzle-orm";

import { db, schema } from "@/db";
import { env } from "@/env";

export async function uploadAssetAction(formData: FormData) {
  const planId = formData.get("planId") as string;
  const displayName = ((formData.get("displayName") as string) ?? "").trim();
  const file = formData.get("file") as File | null;
  if (!file || !displayName) return;

  const buf = Buffer.from(await file.arrayBuffer());
  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storageKey = path.posix.join("plans", planId, `${Date.now()}-${safeFileName}`);
  const absPath = path.resolve(env.CONTENT_STORAGE_DIR, storageKey);

  await mkdir(path.dirname(absPath), { recursive: true });
  await writeFile(absPath, buf);

  const existing = await db
    .select({ order: schema.contentAssets.order })
    .from(schema.contentAssets)
    .where(eq(schema.contentAssets.planId, planId))
    .orderBy(asc(schema.contentAssets.order));
  const nextOrder = existing.length ? existing[existing.length - 1].order + 1 : 0;

  await db.insert(schema.contentAssets).values({
    planId,
    storageKey,
    mime: file.type || "application/octet-stream",
    displayName,
    order: nextOrder,
  });

  revalidatePath("/admin/content");
}

export async function deleteAssetAction(formData: FormData) {
  const id = formData.get("id") as string;
  const asset = await db.query.contentAssets.findFirst({
    where: eq(schema.contentAssets.id, id),
  });
  if (!asset) return;

  const absPath = path.resolve(env.CONTENT_STORAGE_DIR, asset.storageKey);
  await rm(absPath, { force: true });

  await db.delete(schema.contentAssets).where(eq(schema.contentAssets.id, id));
  revalidatePath("/admin/content");
}

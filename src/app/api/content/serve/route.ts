import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";

import { db, schema } from "@/db";
import { env } from "@/env";
import { verifyAsset } from "@/lib/signedUrl";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "missing token" }, { status: 404 });
  }

  const payload = verifyAsset(token);
  if (!payload) {
    return NextResponse.json({ error: "expired or invalid" }, { status: 404 });
  }

  const asset = await db.query.contentAssets.findFirst({
    where: eq(schema.contentAssets.id, payload.assetId),
  });
  if (!asset) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const fullPath = path.resolve(env.CONTENT_STORAGE_DIR, asset.storageKey);
  const storageRoot = path.resolve(env.CONTENT_STORAGE_DIR);
  if (!fullPath.startsWith(storageRoot + path.sep) && fullPath !== storageRoot) {
    return NextResponse.json({ error: "invalid path" }, { status: 400 });
  }

  try {
    const stats = await stat(fullPath);
    const stream = createReadStream(fullPath) as unknown as ReadableStream<Uint8Array>;
    return new NextResponse(stream, {
      status: 200,
      headers: {
        "content-type": asset.mime,
        "content-length": String(stats.size),
        "content-disposition": `inline; filename="${asset.displayName}"`,
        "cache-control": "private, max-age=0, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "file not found" }, { status: 404 });
  }
}

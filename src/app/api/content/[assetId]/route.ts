import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/auth";
import { hasAssetAccess } from "@/lib/entitlements";
import { signAsset } from "@/lib/signedUrl";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ assetId: string }> },
) {
  const { assetId } = await params;
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const entitled = await hasAssetAccess(session.user.id, assetId);
  if (!entitled) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const token = signAsset(assetId);
  const url = new URL(`/api/content/serve?token=${encodeURIComponent(token)}`, _req.url);
  return NextResponse.redirect(url, { status: 302 });
}

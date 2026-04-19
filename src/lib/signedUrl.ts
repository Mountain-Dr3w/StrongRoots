import { createHmac, timingSafeEqual } from "node:crypto";

import { env } from "@/env";

export interface SignedPayload {
  assetId: string;
  exp: number;
}

function secret(): string {
  if (!env.SIGNED_URL_SECRET) {
    throw new Error("SIGNED_URL_SECRET is not set");
  }
  return env.SIGNED_URL_SECRET;
}

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export function signAsset(assetId: string, ttlSeconds = 15 * 60): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const body = `${assetId}.${exp}`;
  const sig = sign(body);
  return `${body}.${sig}`;
}

export function verifyAsset(token: string): SignedPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [assetId, expStr, sig] = parts;
  const body = `${assetId}.${expStr}`;
  const expected = sign(body);

  const sigBuf = Buffer.from(sig, "base64url");
  const expBuf = Buffer.from(expected, "base64url");
  if (sigBuf.length !== expBuf.length) return null;
  if (!timingSafeEqual(sigBuf, expBuf)) return null;

  const exp = Number.parseInt(expStr, 10);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return null;

  return { assetId, exp };
}

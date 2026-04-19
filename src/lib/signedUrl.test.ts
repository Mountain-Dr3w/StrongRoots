import { describe, expect, it } from "vitest";

import { signAsset, verifyAsset } from "@/lib/signedUrl";

describe("signedUrl", () => {
  it("round-trips and verifies a freshly signed asset id", () => {
    const token = signAsset("asset-123");
    const payload = verifyAsset(token);
    expect(payload?.assetId).toBe("asset-123");
  });

  it("rejects a tampered token", () => {
    const token = signAsset("asset-123");
    const tampered = token.replace(/.$/, (c) => (c === "a" ? "b" : "a"));
    expect(verifyAsset(tampered)).toBeNull();
  });

  it("rejects an expired token", () => {
    const token = signAsset("asset-expired", -10);
    expect(verifyAsset(token)).toBeNull();
  });

  it("rejects structurally invalid tokens", () => {
    expect(verifyAsset("nope")).toBeNull();
    expect(verifyAsset("only.two")).toBeNull();
  });
});

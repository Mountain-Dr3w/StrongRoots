import { execSync } from "node:child_process";
import path from "node:path";
import { config } from "dotenv";
import postgres from "postgres";

config({ path: path.resolve(__dirname, ".env.local") });

export default async function globalSetup() {
  const url = process.env.DATABASE_URL_TEST;
  if (!url) {
    throw new Error("DATABASE_URL_TEST is required for vitest");
  }

  const sql = postgres(url, { max: 1 });
  await sql.unsafe("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
  await sql.end();

  execSync("npx drizzle-kit push", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: url },
  });
}

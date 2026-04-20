import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const migrationsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "drizzle",
);

const sql = postgres(process.env.DATABASE_URL, { max: 1, onnotice: () => {} });

await sql`
  CREATE TABLE IF NOT EXISTS _migrations (
    name text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )
`;

const entries = (await readdir(migrationsDir))
  .filter((f) => f.endsWith(".sql"))
  .sort();

const applied = new Set(
  (await sql`SELECT name FROM _migrations`).map((row) => row.name),
);

for (const file of entries) {
  if (applied.has(file)) {
    console.log(`[migrate] skip ${file} (already applied)`);
    continue;
  }

  const body = await readFile(path.join(migrationsDir, file), "utf8");
  const statements = body
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter(Boolean);

  console.log(`[migrate] apply ${file} (${statements.length} statements)`);

  await sql.begin(async (tx) => {
    for (const stmt of statements) {
      await tx.unsafe(stmt);
    }
    await tx`INSERT INTO _migrations (name) VALUES (${file})`;
  });
}

await sql.end();
console.log("[migrate] done");

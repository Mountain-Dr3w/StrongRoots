import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env";
import * as schema from "@/db/schema";

const connectionString =
  env.NODE_ENV === "test" && env.DATABASE_URL_TEST
    ? env.DATABASE_URL_TEST
    : env.DATABASE_URL;

const client = postgres(connectionString, { max: 10 });

export const db = drizzle(client, { schema });
export type Database = typeof db;
export { schema };

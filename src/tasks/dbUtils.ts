import { Kysely, PostgresDialect, sql } from "kysely";
import { postgresUrl } from "../environment";

export function databaseName() {
  return postgresUrl().split("/").pop() || "";
}

export function dbUrl() {
  return postgresUrl().split("/").slice(0, -1).join("/");
}

export async function databaseExists(db: Kysely<PostgresDialect>) {
  const result = await sql`SELECT 1 FROM pg_database WHERE datname = ${databaseName()}`.execute(
    db
  );
  return result.rows.length === 1;
}

import { Kysely, ParseJSONResultsPlugin } from "kysely";
import { Database as DatabaseDescription } from "./db";
import { sqliteUrl, databaseDialect, postgresUrl } from "./environment";

export type Database = Kysely<DatabaseDescription>;
let dbInstance: Database | null = null;

async function createPostgresDb() {
  const { Pool } = await import("pg");
  const { PostgresDialect } = await import("kysely");
  const pool = new Pool({
    connectionString: postgresUrl(),
  });
  return new Kysely<DatabaseDescription>({
    dialect: new PostgresDialect({
      pool,
    }),
    plugins: [new ParseJSONResultsPlugin()],
  });
}

async function createSqliteDb() {
  const Database = (await import("better-sqlite3")).default;
  const { SqliteDialect } = await import("kysely");
  return new Kysely<DatabaseDescription>({
    dialect: new SqliteDialect({
      database: new Database(sqliteUrl()),
    }),
    plugins: [new ParseJSONResultsPlugin()],
  });
}

export async function getDb(): Promise<Kysely<DatabaseDescription>> {
  if (databaseDialect() === "sqlite") {
    dbInstance = await createSqliteDb();
  } else if (databaseDialect() === "postgres") {
    dbInstance = await createPostgresDb();
  } else {
    throw new Error("Unsupported database dialect");
  }
  return dbInstance;
}

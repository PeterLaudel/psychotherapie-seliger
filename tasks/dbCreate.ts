import { Kysely, PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { databaseExists, databaseName, dbUrl } from "./dbUtils";

export async function dbCreate() {
  const db = new Kysely<PostgresDialect>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: dbUrl(),
      }),
    }),
  });
  const doesExist = await databaseExists(db);
  if (doesExist) {
    console.log("Database already exists");
  } else {
    console.log("Creating database");
    await sql`CREATE DATABASE ${sql.raw(databaseName())}`.execute(db);
    console.log("Database created");
  }
}

dbCreate().then(() => process.exit(0));

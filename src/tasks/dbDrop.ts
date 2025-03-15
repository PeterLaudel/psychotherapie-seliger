import { Kysely, PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { databaseName, dbUrl, databaseExists } from "./dbUtils";

export async function dbDrop() {
  const db = new Kysely<PostgresDialect>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: dbUrl(),
      }),
    }),
  });

  const dbExists = await databaseExists(db);
  if (dbExists) {
    console.log("Dropping database");
    await sql`DROP DATABASE ${sql.raw(databaseName())}`.execute(db);
    console.log("Database dropped");
  } else {
    console.log("Database does not exist");
  }
}

dbDrop().then(() => process.exit(0));

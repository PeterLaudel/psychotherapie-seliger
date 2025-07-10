import { Kysely } from "kysely";
import { Database } from "@/db";

/**
 * Deletes all rows from all tables in a SQLite database.
 * Does not drop tables or reset autoincrement counters.
 */
export async function clearSqliteDatabase(database: Kysely<Database>) {
  // Query all user tables using Kysely's selectFrom
  const tables = await database.withTables()
    .selectFrom("sqlite_master")
    .select("name")
    .where("type", "=", "table")
    .where("name", "not like", "sqlite_%")
    .where("name", "not like", "kysely_%")
    .execute();

  for (const { name } of tables) {
    await database.deleteFrom(name).execute();
  }
}
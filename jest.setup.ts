import { Kysely, sql } from "kysely";
import { Database } from "./src/db";
import { db } from "./src/initialize";

async function clearDatabase(db: Kysely<Database>) {
  const tables = await db.introspection.getTables();
  for (const table of tables) {
    await sql`TRUNCATE TABLE ${sql.table(
      table.name
    )} RESTART IDENTITY CASCADE`.execute(db);
  }
}

afterEach(async () => {
  await clearDatabase(db);
});

afterAll(async () => {
  await db.destroy();
});

import {
  Kysely,
  ParseJSONResultsPlugin,
  SqliteDialect,
  Migrator,
  FileMigrationProvider,
} from "kysely";
import Database from "better-sqlite3";
import { Database as DatabaseDescription } from "@/db";
import { sqliteUrl } from "../environment";
import fs, { promises } from "fs";
import path from "path";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/sqlite";

export { jsonArrayFrom, jsonObjectFrom };

export async function sqliteDb() {
  return new Kysely<DatabaseDescription>({
    dialect: new SqliteDialect({
      database: new Database(sqliteUrl()),
    }),
    plugins: [new ParseJSONResultsPlugin()],
  });
}

export async function dbCreate() {
  return Promise.resolve(() => {
    const filePath = sqliteUrl();
    console.log(`Creating database file at: ${filePath}`);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "");
      console.log(`Created file: ${filePath}`);
    } else {
      console.log(`File already exists: ${filePath}`);
    }
  });
}

export function dbDrop() {
  const filePath = sqliteUrl();
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Deleted file: ${filePath}`);
  } else {
    console.log(`File does not exist: ${filePath}`);
  }
}

export async function dbMigrate() {
  const migration = new Migrator({
    db: await sqliteDb(),
    provider: new FileMigrationProvider({
      fs: promises,
      path,
      migrationFolder: path.join(__dirname, "/../migrations"),
    }),
  });

  migration.migrateToLatest().then(({ error, results }) => {
    results?.forEach((it) => {
      if (it.status === "Success") {
        console.log(
          `migration "${it.migrationName}" was executed successfully`,
        );
      } else if (it.status === "Error") {
        console.error(`failed to execute migration "${it.migrationName}"`);
      }
    });

    if (error) {
      console.error("failed to migrate");
      console.error(error);
      process.exit(1);
    }
  });
}

export async function clearDatabase(
  db: Kysely<DatabaseDescription>,
  tables: (keyof DatabaseDescription)[],
) {
  for (const table of tables) {
    await db.deleteFrom(table).execute();
  }
}

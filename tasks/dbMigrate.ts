import { FileMigrationProvider, Migrator } from "kysely";
import { promises as fs } from "fs";
import { getDb } from "../src/initialize";
import * as path from "path";

export function dbMigrate() {
  const migration = new Migrator({
    db: getDb(),
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, "/../migrations"),
    }),
  });

  // migration.migrateToLatest();
  migration.migrateToLatest().then(({ error, results }) => {
    results?.forEach((it) => {
      if (it.status === "Success") {
        console.log(
          `migration "${it.migrationName}" was executed successfully`
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

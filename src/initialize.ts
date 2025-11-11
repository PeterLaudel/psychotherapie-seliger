import { Kysely, ParseJSONResultsPlugin, SqliteDialect } from "kysely";
import Database from "better-sqlite3";
import { Database as DatabaseDescription } from "./db";
import { sqliteUrl } from "./environment";

let dbInstance: Kysely<DatabaseDescription> | null = null;

export function getDb(): Kysely<DatabaseDescription> {
  if (!dbInstance) {
    dbInstance = new Kysely<DatabaseDescription>({
      dialect: new SqliteDialect({
        database: new Database(sqliteUrl()),
      }),
      plugins: [new ParseJSONResultsPlugin()],
    });
  } 
  return dbInstance;
}

export function setDbInstance(db: Kysely<DatabaseDescription>) {
  dbInstance = db;
}

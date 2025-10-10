import { Kysely, ParseJSONResultsPlugin, SqliteDialect } from "kysely";
import Database from 'better-sqlite3'
import { Database as DatabaseDescription } from "./db";
import { sqliteUrl } from "./environment";


export const db = new Kysely<DatabaseDescription>({
  dialect: new SqliteDialect({
    database: new Database(sqliteUrl())
  }),
  plugins: [new ParseJSONResultsPlugin()],
});


let dbInstance: Kysely<DatabaseDescription> | null = null;

export function getDb(): Kysely<DatabaseDescription> {
  if (!dbInstance) {
    dbInstance = new Kysely<DatabaseDescription>({
      dialect: new SqliteDialect({
        database: new Database(sqliteUrl())
      }),
      plugins: [new ParseJSONResultsPlugin()],
    });
  }
  return dbInstance;
}
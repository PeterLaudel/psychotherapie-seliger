import { Kysely, ParseJSONResultsPlugin, SqliteDialect } from "kysely";
import pg from "pg";
import Database from 'better-sqlite3'
import { Database as DatabaseDescription } from "./db";
import { sqliteUrl } from "./environment";

pg.types.setTypeParser(pg.types.builtins.DATE, (val) => val);

export const db = new Kysely<DatabaseDescription>({
  dialect: new SqliteDialect({
    database: new Database(sqliteUrl())
  }),
  plugins: [new ParseJSONResultsPlugin()],
});

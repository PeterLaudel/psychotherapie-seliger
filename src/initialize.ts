import { Kysely, ParseJSONResultsPlugin, PostgresDialect } from "kysely";
import { Pool } from "pg";
import pg from "pg";
import { postgresUrl } from "./environment";
import { Database } from "./db";

pg.types.setTypeParser(pg.types.builtins.DATE, (val) => val);

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: postgresUrl(),
    }),
  }),
  plugins: [new ParseJSONResultsPlugin()],
});

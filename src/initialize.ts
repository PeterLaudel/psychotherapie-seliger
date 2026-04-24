import { Kysely } from "kysely";
import { Database as DatabaseDescription } from "./db";
import { dbConnect } from "./database";

export type Database = Kysely<DatabaseDescription>;
let dbInstance: Database | null = null;

export async function getDb(): Promise<Kysely<DatabaseDescription>> {
  if (dbInstance) return dbInstance;

  dbInstance = await dbConnect();
  return dbInstance;
}

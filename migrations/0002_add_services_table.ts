import { databaseDialect } from "../src/environment";
import { Kysely } from "kysely";

export async function up(kysely: Kysely<unknown>) {
  const base = kysely.schema
    .createTable("services")
    .addColumn("short", "text", (col) => col.notNull())
    .addColumn("originalGopNr", "text", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("note", "text", (col) => col.defaultTo(null))
    .addColumn("points", "integer", (col) => col.notNull());
    

  if (databaseDialect() === "postgres") {
    await base.addColumn("id", "serial", (col) => col.primaryKey()).execute();
  } else if (databaseDialect() === "sqlite") {
    await base.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement()).execute();
  }
}

export async function down(kysely: Kysely<unknown>) {
  await kysely.schema.dropTable("services").execute();
}

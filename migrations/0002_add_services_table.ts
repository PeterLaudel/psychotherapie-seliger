import { Kysely } from "kysely";

export async function up(kysely: Kysely<unknown>) {
  await kysely.schema
    .createTable("services")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("short", "text")
    .addColumn("originalGopNr", "text")
    .addColumn("description", "text")
    .addColumn("note", "text", (col) => col.defaultTo(null))
    .addColumn("points", "integer")
    .addColumn("amounts", "jsonb")
    .execute();
}

export async function down(kysely: Kysely<unknown>) {
  await kysely.schema.dropTable("services").execute();
}

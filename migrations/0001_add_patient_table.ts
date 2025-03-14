import { Kysely } from "kysely";

export async function up(kysely: Kysely<unknown>): Promise<void> {
  await kysely.schema
    .createTable("patients")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "text")
    .addColumn("surname", "text")
    .addColumn("email", "text")
    .addColumn("birthdate", "date")
    .execute();
}

export async function down(kysely: Kysely<unknown>): Promise<void> {
  await kysely.schema.dropTable("patients").execute();
}

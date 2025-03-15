import { Kysely } from "kysely";

export async function up(kysely: Kysely<unknown>): Promise<void> {
  await kysely.schema
    .createTable("patients")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "text")
    .addColumn("surname", "text")
    .addColumn("email", "text")
    .addColumn("birthdate", "date")
    .addColumn("street", "text")
    .addColumn("city", "text")
    .addColumn("zip", "text")
    .addColumn("billingName", "text")
    .addColumn("billingSurname", "text")
    .addColumn("billingEmail", "text")
    .addColumn("billingStreet", "text")
    .addColumn("billingCity", "text")
    .addColumn("billingZip", "text")
    .execute();
}

export async function down(kysely: Kysely<unknown>): Promise<void> {
  await kysely.schema.dropTable("patients").execute();
}

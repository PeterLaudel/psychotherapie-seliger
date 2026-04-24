import { Kysely, sql } from "kysely";
import { databaseDialect } from "../src/environment";

export async function up(kysely: Kysely<unknown>): Promise<void> {
  const base = kysely.schema
    .createTable("patients")
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("surname", "text", (col) => col.notNull())
    .addColumn("email", "text", (col) => col.notNull())
    .addColumn("birthdate", "text", (col) => col.notNull())
    .addColumn("street", "text", (col) => col.notNull())
    .addColumn("city", "text", (col) => col.notNull())
    .addColumn("zip", "text", (col) => col.notNull())
    .addColumn("billingName", "text", (col) => col.notNull())
    .addColumn("billingSurname", "text", (col) => col.notNull())
    .addColumn("billingEmail", "text", (col) => col.notNull())
    .addColumn("billingStreet", "text", (col) => col.notNull())
    .addColumn("billingCity", "text", (col) => col.notNull())
    .addColumn("billingZip", "text", (col) => col.notNull())
    .addColumn("createdAt", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    
  if(databaseDialect() === "postgres") {
    await base.addColumn("id", "serial", (col) => col.primaryKey()).execute();
  }
  else if(databaseDialect() === "sqlite") {
    await base.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement()).execute();
  }
}

export async function down(kysely: Kysely<unknown>): Promise<void> {
  await kysely.schema.dropTable("patients").execute();
}
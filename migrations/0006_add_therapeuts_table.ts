import { databaseDialect } from "../src/environment";
import { Kysely } from "kysely";

export async function up(kysely: Kysely<unknown>) {
  const base = kysely.schema
    .createTable("therapeuts")
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("surname", "text", (col) => col.notNull())
    .addColumn("street", "text", (col) => col.notNull())
    .addColumn("zip", "text", (col) => col.notNull())
    .addColumn("city", "text", (col) => col.notNull())
    .addColumn("email", "text", (col) => col.notNull())
    .addColumn("phone", "text", (col) => col.notNull())
    .addColumn("taxId", "text", (col) => col.notNull())
    .addColumn("bankName", "text", (col) => col.notNull())
    .addColumn("iban", "text", (col) => col.notNull())
    .addColumn("bic", "text", (col) => col.notNull())
    .addColumn("website", "text", (col) => col.notNull())
    .addColumn("enr", "text", (col) => col.notNull());

  if (databaseDialect() === "postgres") {
    await base.addColumn("id", "serial", (col) => col.primaryKey()).execute();
  } else if (databaseDialect() === "sqlite") {
    await base
      .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
      .execute();
  }
}

export async function down(kysely: Kysely<unknown>) {
  await kysely.schema.dropTable("therapeuts").execute();
}

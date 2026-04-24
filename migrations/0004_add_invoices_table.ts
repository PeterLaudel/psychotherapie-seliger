import { databaseDialect } from "../src/environment";
import { Kysely, sql } from "kysely";

export async function up(kysely: Kysely<unknown>) {
  const isPostgres = databaseDialect() === "postgres";
  await kysely.schema.createTable("invoices")
    .addColumn("id", isPostgres ? "serial" : "integer", (col) =>
      isPostgres ? col.primaryKey() : col.primaryKey().autoIncrement()
    )
    .addColumn("invoiceNumber", "text", (col) => col.notNull())
    .addColumn("base64Pdf", "text", (col) => col.notNull())
    .addColumn("invoiceAmount", "real", (col) => col.notNull())
    .addColumn("createdAt", "text", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();
}

export async function down(kysely: Kysely<unknown>) {
  await kysely.schema.dropTable("invoices").execute();
}

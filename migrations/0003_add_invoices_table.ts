import { Kysely, sql } from "kysely";

export async function up(kysely: Kysely<unknown>) {
  await kysely.schema
    .createTable("invoices")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("patientId", "integer", (col) =>
      col.references("patients.id").onDelete("cascade").notNull()
    )
    .addColumn("invoiceNumber", "text", (col) => col.notNull())
    .addColumn("createdAt", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();
}

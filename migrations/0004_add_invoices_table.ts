import { Kysely, sql } from "kysely";

export async function up(kysely: Kysely<unknown>) {
  await kysely.schema
    .createTable("invoices")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("patientId", "integer", (col) =>
      col.references("patients.id").onDelete("cascade").notNull()
    )
    .addColumn("invoiceNumber", "text", (col) => col.notNull())
    .addColumn("base64Pdf", "text", (col) => col.notNull())
    .addColumn("createdAt", "text", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();
}

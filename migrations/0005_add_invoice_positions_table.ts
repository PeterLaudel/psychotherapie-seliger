import { Kysely } from "kysely";

export async function up(kysely: Kysely<unknown>) {
  await kysely.schema
    .createTable("invoicePositions")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("invoiceId", "integer", (col) =>
      col.references("invoices.id").onDelete("cascade").notNull()
    )
    .addColumn("serviceDate", "date", (col) => col.notNull())
    .addColumn("serviceId", "integer", (col) =>
      col.references("services.id").onDelete("cascade").notNull()
    )
    .addColumn("amount", "integer", (col) => col.notNull())
    .addColumn("factor", "text", (col) => col.notNull())
    .addColumn("pageBreak", "boolean", (col) => col.defaultTo(false))
    .execute();
}

export async function down(kysely: Kysely<unknown>) {
  await kysely.schema.dropTable("invoicePositions").execute();
}

import { Kysely } from "kysely";

export async function up(kysely: Kysely<unknown>) {
  await kysely.schema
    .createTable("invoicePositions")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("invoiceId", "integer", (col) =>
      col.references("invoices.id").onDelete("cascade").notNull()
    )
    .addColumn("serviceDate", "text", (col) => col.notNull()) // store as ISO string
    .addColumn("serviceId", "integer", (col) =>
      col.references("services.id").onDelete("cascade").notNull()
    )
    .addColumn("amount", "integer", (col) => col.notNull())
    .addColumn("factor", "text", (col) => col.notNull())
    .addColumn("pageBreak", "integer", (col) => col.defaultTo(0))
    .execute();
}

export async function down(kysely: Kysely<unknown>) {
  await kysely.schema.dropTable("invoicePositions").execute();
}

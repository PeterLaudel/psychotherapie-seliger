import { Kysely } from "kysely";

export async function up(kysely: Kysely<unknown>) {
  await kysely.schema
    .createTable("invoicePositions")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("invoiceId", "integer", (col) =>
      col.references("invoices.id").onDelete("cascade")
    )
    .addColumn("serviceDate", "date")
    .addColumn("serviceId", "integer", (col) =>
      col.references("services.id").onDelete("cascade")
    )
    .addColumn("amount", "integer")
    .addColumn("factor", "text")
    .execute();
}

export async function down(kysely: Kysely<unknown>) {
  await kysely.schema.dropTable("invoicePositions").execute();
}

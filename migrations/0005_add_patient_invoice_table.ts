import { Database } from "../src/db";
import { databaseDialect } from "../src/environment";
import { Kysely } from "kysely";

export async function up(kysely: Kysely<Database>) {
  const isPostgres = databaseDialect() === "postgres";
  await kysely.schema
    .createTable("patientInvoices")
    .addColumn("id", isPostgres ? "serial" : "integer", (col) =>
      isPostgres ? col.primaryKey() : col.primaryKey().autoIncrement()
    )
    .addColumn("patientId", "integer", (col) =>
      col.references("patients.id").onDelete("cascade").notNull(),
    )
    .addColumn("invoiceId", "integer", (col) =>
      col.references("invoices.id").onDelete("cascade").notNull(),
    )
    .execute();
}

export async function down(kysely: Kysely<unknown>) {
  await kysely.schema.dropTable("patientInvoices").execute();
}

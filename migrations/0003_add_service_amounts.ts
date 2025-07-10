import { Kysely } from "kysely";

export function up(kysely: Kysely<unknown>) {
  return kysely.schema
    .createTable("serviceAmounts")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("serviceId", "integer", (col) =>
      col.references("services.id").onDelete("cascade").notNull()
    )
    .addColumn("factor", "text", (col) => col.notNull())
    .addColumn("price", "real", (col) => col.notNull())
    .execute();
}

export function down(kysely: Kysely<unknown>) {
  return kysely.schema.dropTable("serviceAmounts").execute();
}

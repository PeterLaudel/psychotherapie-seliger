import { Kysely } from "kysely";
import { databaseDialect } from "../src/environment";

export async function up(kysely: Kysely<unknown>) {
  const isPostgres = databaseDialect() === "postgres";
  await kysely.schema.createTable("serviceAmounts").
    addColumn("id", isPostgres ? "serial" : "integer", (col) =>
      isPostgres ? col.primaryKey() : col.primaryKey().autoIncrement()
    )
    .addColumn("serviceId", "integer", (col) =>
      col.references("services.id").onDelete("cascade").notNull(),
    )
    .addColumn("factor", "text", (col) => col.notNull())
    .addColumn("price", "real", (col) => col.notNull())
    .execute();
}

export function down(kysely: Kysely<unknown>) {
  return kysely.schema.dropTable("serviceAmounts").execute();
}

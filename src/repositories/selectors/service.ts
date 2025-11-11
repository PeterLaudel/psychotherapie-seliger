import { getDb } from "@/initialize";
import { Expression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/sqlite";

export function serviceSelector(database = getDb()) {
  return database
    .selectFrom("services")
    .select(({ ref }) => [
      "id",
      "description",
      "note",
      "originalGopNr",
      "points",
      "short",
      amounts(ref("services.id"), database).as("amounts"),
    ]);
}

function amounts(ref: Expression<number>, database: ReturnType<typeof getDb>) {
  return jsonArrayFrom(
    database
      .selectFrom("serviceAmounts")
      .select(["factor", "price"])
      .whereRef(ref, "=", "serviceId")
  );
}

import { getDb } from "@/initialize";
import { Expression } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/sqlite";

export function patientSelectorJson(database = getDb()) {
    return jsonObjectFrom(patientSelector(database))
}

export function patientSelector(database = getDb()) {
  return database
    .selectFrom("patients")
    .select(["id", "name", "surname", "email", "birthdate"])
    .select((eb) => [
      address(eb.ref("patients.id"), database).as("address"),
      billingInfo(eb.ref("patients.id"), database).as("billingInfo"),
    ]);
}

function address(
  patientId: Expression<number>,
  database: ReturnType<typeof getDb>
) {
  return jsonObjectFrom(
    database
      .selectFrom("patients as address")
      .select(["street", "zip", "city"])

      .whereRef(patientId, "=", "address.id")
  ).$notNull();
}

function billingInfo(
  patientId: Expression<number>,
  database: ReturnType<typeof getDb>
) {
  return jsonObjectFrom(
    database
      .selectFrom("patients as billing")
      .select([
        "billingName as name",
        "billingSurname as surname",
        "billingEmail as email",
      ])
      .select((eb) => [
        billingAddress(eb.ref("billing.id"), database).as("address"),
      ])
      .whereRef(patientId, "=", "billing.id")
  ).$notNull();
}

function billingAddress(
  patientId: Expression<number>,
  database: ReturnType<typeof getDb>
) {
  return jsonObjectFrom(
    database
      .selectFrom("patients as billingAddress")
      .select([
        "billingStreet as street",
        "billingZip as zip",
        "billingCity as city",
      ])
      .whereRef(patientId, "=", "billingAddress.id")
  ).$notNull();
}

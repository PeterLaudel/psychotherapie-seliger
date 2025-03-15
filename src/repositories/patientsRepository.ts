import { Expression, Simplify, sql } from "kysely";
import { Patient } from "@/models/patient";
import { db } from "@/initialize";

function jsonObjectFrom<O>(expr: Expression<O>) {
  return sql<Simplify<O>>`(select to_json(obj) from ${expr} as obj)`;
}

export class PatientsRepository {
  constructor(private readonly database = db) {}

  async get(): Promise<Patient[]> {
    return await this.database
      .selectFrom("patients")
      .select(["id", "name", "surname", "email", "birthdate"])
      .select(({ ref }) => [
        this.address(ref("patients.id")).as("address"),
        this.billingInfo(ref("patients.id")).as("billingInfo"),
      ])
      .execute();
  }

  async create(patient: Omit<Patient, "id">): Promise<Patient> {
    const { address, billingInfo, ...rest } = patient;
    const mappedBillingInfo = {
      billingName: billingInfo.name,
      billingSurname: billingInfo.surname,
      billingEmail: billingInfo.email,
      billingStreet: billingInfo.address.street,
      billingCity: billingInfo.address.city,
      billingZip: billingInfo.address.zip,
    };
    const { id } = await this.database
      .insertInto("patients")
      .values({ ...rest, ...address, ...mappedBillingInfo })
      .returning(["id"])
      .executeTakeFirstOrThrow();

    return await this.database
      .selectFrom("patients")
      .select(["id", "name", "surname", "email", "birthdate"])
      .select(({ ref }) => [
        this.address(ref("patients.id")).as("address"),
        this.billingInfo(ref("patients.id")).as("billingInfo"),
      ])
      .where("id", "=", id)
      .executeTakeFirstOrThrow();
  }

  private address(patientId: Expression<number>) {
    return jsonObjectFrom(
      this.database
        .selectFrom("patients as address")
        .select(["street", "zip", "city"])
        .whereRef(patientId, "=", "address.id")
    );
  }

  private billingInfo(patientId: Expression<number>) {
    return jsonObjectFrom(
      this.database
        .selectFrom("patients")
        .select([
          "billingName as name",
          "billingSurname as surname",
          "billingEmail as email",
        ])
        .select(() => [this.billingAddress(patientId).as("address")])
        .whereRef(patientId, "=", "id")
    );
  }

  private billingAddress(patientId: Expression<number>) {
    return jsonObjectFrom(
      this.database
        .selectFrom("patients")
        .select([
          "billingStreet as street",
          "billingZip as zip",
          "billingCity as city",
        ])
        .whereRef(patientId, "=", "id")
    );
  }
}

import { Expression, Simplify, sql } from "kysely";
import { db } from "@/initialize";

interface Address {
  street: string;
  city: string;
  zip: string;
}

interface Patient {
  id: number;
  name: string;
  surname: string;
  email: string;
  birthdate: string;
}

export class Repository<T extends Patient = Patient> {
  constructor(
    private readonly database = db,
    private readonly query = database
      .selectFrom("patients")
      .select(["id", "name", "surname", "email"])
      .$castTo<T>()
  ) {}

  public withBirthdate(): Repository<T & { birthdate: string }> {
    return new Repository(this.database, this.query.select("birthdate"));
  }

  public withAddress(): Repository<T & { address: Address }> {
    return new Repository(
      this.database,
      this.query.select((eb) =>
        this.address(eb.ref("patients.id")).as("address")
      )
    );
  }

  public async all(): Promise<T[]> {
    return await this.query.execute();
  }

  private address(patientId: Expression<number>) {
    return jsonObjectFrom(
      this.database
        .selectFrom("patients as address")
        .select(["street", "zip", "city"])
        .whereRef(patientId, "=", "address.id")
    );
  }
}

function jsonObjectFrom<O>(expr: Expression<O>) {
  return sql<Simplify<O>>`(select to_json(obj) from ${expr} as obj)`;
}

const repo = new Repository();
const result = await repo.withAddress().withBirthdate().all();

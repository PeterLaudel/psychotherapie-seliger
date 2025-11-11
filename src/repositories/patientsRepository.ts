import { Patient } from "@/models/patient";
import { getDb } from "@/initialize";
import { patientSelector } from "./selectors/patient";

export class PatientsRepository {
  constructor(private readonly database = getDb()) {}

  async find(id: number): Promise<Patient> {
    return await patientSelector(this.database)
      .where("id", "=", id)
      .executeTakeFirstOrThrow();
  }

  async all(): Promise<Patient[]> {
    return await patientSelector(this.database).execute();
  }

  async create(patient: Omit<Patient, "id">): Promise<Patient> {
    const { address, billingInfo, ...rest } = patient;
    const { id } = await this.database
      .insertInto("patients")
      .values({
        ...rest,
        ...address,
        billingName: billingInfo.name,
        billingSurname: billingInfo.surname,
        billingEmail: billingInfo.email,
        billingStreet: billingInfo.address.street,
        billingCity: billingInfo.address.city,
        billingZip: billingInfo.address.zip,
      })
      .returning(["id"])
      .executeTakeFirstOrThrow();

    return await this.find(id);
  }
}

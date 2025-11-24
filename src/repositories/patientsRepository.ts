import { Patient } from "@/models/patient";
import { getDb } from "@/initialize";
import { patientSelector } from "./selectors/patient";

export type PatientSave = Omit<Patient, "id"> & { id?: number };

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

  async save(patient: PatientSave): Promise<Patient> {
    return await this.database.transaction().execute(async (trx) => {
      const { address, billingInfo, id: originId, ...rest } = patient;
      const data = {
        ...rest,
        ...address,
        billingName: billingInfo.name,
        billingSurname: billingInfo.surname,
        billingEmail: billingInfo.email,
        billingStreet: billingInfo.address.street,
        billingCity: billingInfo.address.city,
        billingZip: billingInfo.address.zip,
      };
      const { id } = originId
        ? await trx
            .updateTable("patients")
            .set(data)
            .returning(["id"])
            .where("patients.id", "=", originId)
            .executeTakeFirstOrThrow()
        : await trx
            .insertInto("patients")
            .values(data)
            .returning(["id"])
            .executeTakeFirstOrThrow();

      return await patientSelector(trx)
        .where("patients.id", "=", id)
        .executeTakeFirstOrThrow();
    });
  }

  async delete(patientId: number) {
    await this.database
      .deleteFrom("patients")
      .where("id", "=", patientId)
      .execute();
  }
}

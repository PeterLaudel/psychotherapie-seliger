"use server";

import { CreatePatient } from "../../../../repositories/patients";
import { getPatientRepository } from "../../../../server";

export default async function createPatient(createPatient: CreatePatient) {
  const repository = await getPatientRepository();
  await repository.create(createPatient);
}

"use server";

import { CreatePatient } from "../../../../repositories/patients/create";
import { getPatientsRepository } from "../../../../server";

export default async function createPatient(createPatient: CreatePatient) {
  const repository = await getPatientsRepository();
  await repository.create(createPatient);
}

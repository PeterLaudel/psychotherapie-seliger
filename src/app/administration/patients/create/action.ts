"use server";

import { Patient } from "@/models/patient";
import { getPatientsRepository } from "@/server";

export default async function createPatient(
  createPatient: Omit<Patient, "id">
) {
  const repository = await getPatientsRepository();
  await repository.create(createPatient);
}

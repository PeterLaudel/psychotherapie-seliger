"use server";

import { getPatientsRepository } from "@/server";
import { CreatePatient } from "@/repositories/patients";

export default async function createPatient(createPatient: CreatePatient) {
  const repository = await getPatientsRepository();
  await repository.create(createPatient);
}

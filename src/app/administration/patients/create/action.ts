"use server";

import { revalidatePath } from "next/cache";
import { Patient } from "@/models/patient";
import { getPatientsRepository } from "@/server";

export default async function createPatient(
  createPatient: Omit<Patient, "id">
) {
  const repository = await getPatientsRepository();
  await repository.save(createPatient);

  revalidatePath("/administration/patients");
}

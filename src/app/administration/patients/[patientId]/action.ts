"use server"

import { PatientSave } from "@/repositories/patientsRepository";
import { getPatientsRepository } from "@/server";
import { revalidatePath } from "next/cache";


export async function updatePatient(patient: PatientSave) {
    const patientsRepository = await getPatientsRepository();
    await patientsRepository.save(patient)

    revalidatePath('/administration/patients')
}
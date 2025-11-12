"use server"

import { PatientSave } from "@/repositories/patientsRepository";
import { getPatientsRepository } from "@/server";
import { revalidatePath } from "next/cache";


export async function updatePatient(patient: PatientSave) {

    console.log(patient)
    const patientsRepository = await getPatientsRepository();
    patientsRepository.save(patient)

    revalidatePath('/administration/patients')
}
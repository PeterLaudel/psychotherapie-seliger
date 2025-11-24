import PatientsList from "./patientsList";
import { getPatientsRepository } from "@/server";

export default async function Page() {
  const patientsRepository = await getPatientsRepository();
  const patients = await patientsRepository.all();

  return <PatientsList patients={patients} />;
}

import { getPatientRepository } from "../../../server";
import Sheets from "./sheets";

export default async function Administration() {
  const patientRepository = await getPatientRepository();
  const patients = await patientRepository.get();

  return <Sheets patients={patients} />;
}

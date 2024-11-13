import { getPatientRepository, getServicesRepository } from "../../../server";
import Sheets from "./sheets";

export default async function Administration() {
  const patientRepository = await getPatientRepository();
  const patients = await patientRepository.get();

  const servicesRepository = await getServicesRepository();
  const services = await servicesRepository.get();

  return <Sheets patients={patients} services={services} />;
}

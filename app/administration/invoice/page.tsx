import { getPatientRepository, getServicesRepository } from "../../../server";
import InvoiceForm from "./invoiceForm";

export default async function Administration() {
  const patientRepository = await getPatientRepository();
  const patients = await patientRepository.get();

  const servicesRepository = await getServicesRepository();
  const services = await servicesRepository.get();

  return <InvoiceForm patients={patients} services={services} />;
}

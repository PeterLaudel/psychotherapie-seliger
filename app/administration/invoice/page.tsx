"use server";

import { getPatientsRepository, getServicesRepository } from "../../../server";
import InvoiceForm from "./invoiceForm";

export default async function Administration() {
  const patientRepository = await getPatientsRepository();
  const patients = await patientRepository.get();

  const servicesRepository = await getServicesRepository();
  const services = await servicesRepository.get();

  return <InvoiceForm patients={patients} services={services} />;
}

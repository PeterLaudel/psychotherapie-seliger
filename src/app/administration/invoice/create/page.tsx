"use server";

import InvoiceForm from "./invoiceForm";
import {
  getInvoicesRepository,
  getPatientsRepository,
  getServicesRepository,
} from "@/server";

export default async function Administration() {
  const patientRepository = await getPatientsRepository();
  const patients = await patientRepository.all();

  const servicesRepository = getServicesRepository();
  const services = await servicesRepository.all();

  const invoiceRepository = await getInvoicesRepository();
  const invoiceNumber = await invoiceRepository.generateInvoiceNumber();

  return (
    <InvoiceForm
      patients={patients}
      services={services}
      invoiceNumber={invoiceNumber}
    />
  );
}

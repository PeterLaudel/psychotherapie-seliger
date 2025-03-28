"use server";

import InvoiceForm from "./invoiceForm";
import {
  getInvoicesRepository,
  getPatientsRepository,
  getServicesRepository,
} from "@/server";

export default async function Administration() {
  const patientRepository = await getPatientsRepository();
  const patients = await patientRepository.get();

  const servicesRepository = getServicesRepository();
  const services = servicesRepository.get();

  const invoiceRepository = await getInvoicesRepository();
  const invoiceName = await invoiceRepository.generateInvoiceNumber();

  return (
    <InvoiceForm
      patients={patients}
      services={services}
      invoiceNumber={invoiceName}
    />
  );
}

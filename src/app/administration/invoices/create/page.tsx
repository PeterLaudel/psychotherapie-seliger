"use server";

import InvoiceForm from "./invoiceForm";
import {
  getInvoicesRepository,
  getPatientsRepository,
  getServicesRepository,
  getTherapeutsRepository,
} from "@/server";

export default async function Administration() {
  const patientRepository = await getPatientsRepository();
  const patients = await patientRepository.all();

  const servicesRepository = getServicesRepository();
  const services = await servicesRepository.all();

  const invoiceRepository = await getInvoicesRepository();
  const invoiceNumber = await invoiceRepository.generateInvoiceNumber();

  const therapeutsRepository = await getTherapeutsRepository();
  const therapeuts = await therapeutsRepository.all();
  const therapeut = therapeuts[0];
  if (!therapeut) {
    return <div>Bitte legen Sie zuerst den Therapeut vollständig an!</div>;
  }

  return (
    <InvoiceForm
      therapeut={therapeut}
      patients={patients}
      services={services}
      invoiceNumber={invoiceNumber}
    />
  );
}

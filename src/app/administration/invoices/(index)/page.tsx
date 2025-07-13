import { InvoicesList } from "./invoicesList";
import { getInvoicesRepository } from "@/server";

export default async function Page() {
  const invoiceRepository = await getInvoicesRepository();
  const invoices = await invoiceRepository.all();

  return <InvoicesList invoices={invoices} />;
}

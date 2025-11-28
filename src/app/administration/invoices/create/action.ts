"use server";

import { revalidatePath } from "next/cache";
import { getInvoicesRepository } from "@/server";
import { InvoiceSave } from "@/repositories/invoicesRepository";

export async function createInvoice(invoiceCreate: InvoiceSave) {
  const invoicesRepository = await getInvoicesRepository();
  const createdInvoice = await invoicesRepository.save(invoiceCreate);

  revalidatePath("/administration/invoice/create");
  return createdInvoice;
}

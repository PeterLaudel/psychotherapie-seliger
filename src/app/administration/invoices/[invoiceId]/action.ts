"use server";

import { InvoiceSave } from "@/repositories/invoicesRepository";
import { getInvoicesRepository } from "@/server";
import { revalidatePath } from "next/cache";

export async function updateInvoice(invoice: InvoiceSave) {
  const invoicesRepository = await getInvoicesRepository();
  await invoicesRepository.save(invoice);

  revalidatePath(`/administration/invoices/${invoice.id}`);
}

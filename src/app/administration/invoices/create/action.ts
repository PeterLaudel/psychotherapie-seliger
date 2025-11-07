"use server";

import { revalidatePath } from "next/cache";
import { getInvoicesRepository } from "@/server";
import { InvoiceCreate } from "@/repositories/invoicesRepository";

export async function createInvoice(invoiceCreate: InvoiceCreate) {
  const invoicesRepository = await getInvoicesRepository();
  await invoicesRepository.save(invoiceCreate);
  revalidatePath("/administration/invoice/create");
}

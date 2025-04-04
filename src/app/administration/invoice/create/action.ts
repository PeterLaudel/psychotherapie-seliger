"use server";

import { getInvoicesRepository } from "@/server";
import { InvoiceCreate } from "@/repositories/invoicesRepository";
import { revalidatePath } from "next/cache";

export async function createInvoice(invoiceCreate: InvoiceCreate) {
  const invoicesRepository = await getInvoicesRepository();
  await invoicesRepository.create(invoiceCreate);
  revalidatePath("/administration/invoice/create");
}

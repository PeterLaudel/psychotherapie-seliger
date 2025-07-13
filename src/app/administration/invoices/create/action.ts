"use server";

import { revalidatePath } from "next/cache";
import { getInvoicesRepository } from "@/server";
import { InvoiceCreate } from "@/repositories/invoicesRepository";

export async function createInvoice(invoiceCreate: InvoiceCreate) {
  const invoicesRepository = await getInvoicesRepository();
  await invoicesRepository.create(invoiceCreate);
  revalidatePath("/administration/invoice/create");
}

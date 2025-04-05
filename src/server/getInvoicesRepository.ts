import { InvoicesRepository } from "@/repositories/invoicesRepository";

export async function getInvoicesRepository(): Promise<InvoicesRepository> {
  return Promise.resolve(new InvoicesRepository());
}

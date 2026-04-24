import { InvoicesRepository } from "@/repositories/invoicesRepository";
import { getDb } from "@/initialize";

export async function getInvoicesRepository(): Promise<InvoicesRepository> {
  const db = await getDb();
  return new InvoicesRepository(db);
}

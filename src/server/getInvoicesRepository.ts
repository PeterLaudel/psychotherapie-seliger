import { drive_v3 } from "@googleapis/drive";
import { InvoicesRepository } from "../repositories/invoices";
import { getAuthClient } from "./getAuthClient";

export async function getInvoicesRepository(): Promise<InvoicesRepository> {
  const auth = await getAuthClient();
  const drive = new drive_v3.Drive({ auth });
  return new InvoicesRepository(drive);
}

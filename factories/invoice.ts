import { Factory } from "fishery";
import { db } from "@/initialize";
import type { Invoice } from "@/models/invoiceProcess";

export const invoiceFactory = Factory.define<
  Omit<Invoice, "id">,
  { withPatient?: boolean },
  Invoice
>(({ associations, sequence }) => ({
  patientId: associations?.patientId ?? sequence,
})).onCreate(async (invoice) => {
  return await db
    .insertInto("invoices")
    .values(invoice)
    .returningAll()
    .executeTakeFirstOrThrow();
});

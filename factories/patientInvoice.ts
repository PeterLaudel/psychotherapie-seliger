import type { PatientInvoiceTable } from "@/db";
import { getDb } from "@/initialize";
import { Factory } from "fishery";

export const patientInvoiceFactory = Factory.define<
  Omit<PatientInvoiceTable, "id">,
  unknown,
  Omit<PatientInvoiceTable, "id"> & { id: number }
>(({ sequence }) => ({
  patientId: sequence,
  invoiceId: sequence,
})).onCreate(async (patientInvoice) => {
  return await getDb()
    .insertInto("patientInvoices")
    .values({
      patientId: patientInvoice.patientId,
      invoiceId: patientInvoice.invoiceId,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
});

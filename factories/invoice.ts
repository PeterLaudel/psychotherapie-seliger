import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import { db } from "@/initialize";
import type { Invoice } from "@/models/invoice";

export const invoiceFactory = Factory.define<
  Omit<Invoice, "id">,
  { withPatient?: boolean },
  Invoice
>(({ associations, sequence }) => ({
  patientId: associations?.patientId ?? sequence,
  invoiceNumber: `${faker.date
    .birthdate()
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "")}${sequence}`,
})).onCreate(async (invoice) => {
  return await db
    .insertInto("invoices")
    .values(invoice)
    .returning(["id", "patientId", "invoiceNumber"])
    .executeTakeFirstOrThrow();
});

import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import { factorArray } from "@/models/service";
import { db } from "@/initialize";
import type { Invoice, InvoicePosition } from "@/models/invoiceProcess";

export const invoicePositionFactory = Factory.define<
  Omit<InvoicePosition, "id">,
  unknown,
  InvoicePosition
>(({ associations, sequence }) => ({
  invoiceId: associations?.invoiceId ?? sequence,
  serviceDate: faker.date.past().toISOString().split("T")[0],
  serviceId: associations?.serviceId ?? sequence,
  factor: faker.helpers.arrayElement(factorArray),
  amount: faker.number.int({ min: 1, max: 1000 }),
})).onCreate(async (invoicePosition) => {
  return await db
    .insertInto("invoicePositions")
    .values(invoicePosition)
    .returningAll()
    .executeTakeFirstOrThrow();
});

export const invoiceFactory = Factory.define<
  Omit<Invoice, "id">,
  unknown,
  Invoice
>(({ associations, sequence }) => ({
  id: sequence,
  patientId: associations?.patientId ?? sequence,
})).onCreate(async (invoice) => {
  return await db
    .insertInto("invoices")
    .values(invoice)
    .returningAll()
    .executeTakeFirstOrThrow();
});

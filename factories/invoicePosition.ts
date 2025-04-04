import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import { factorArray } from "@/models/service";
import { InvoicePosition } from "@/models/invoiceProcess";
import { db } from "@/initialize";

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

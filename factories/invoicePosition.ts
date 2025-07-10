import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import { factorArray } from "@/models/service";
import { InvoicePosition } from "@/models/invoicePosition";
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
  pageBreak: false,
  amount: faker.number.int({ min: 1, max: 1000 }),
})).onCreate(async (invoicePosition) => {
  const result =  await db
    .insertInto("invoicePositions")
    .values({
      ...invoicePosition,
      pageBreak: invoicePosition.pageBreak ? 1 : 0, // Convert boolean to integer
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return {
    ...result,
    pageBreak: result.pageBreak === 1, // Convert back to boolean
  };
});

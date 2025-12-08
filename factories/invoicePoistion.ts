import type { InvoicePositionsTable } from "@/db";
import { getDb } from "@/initialize";
import { faker } from "@faker-js/faker";
import { Factory } from "fishery";

export const invoicePositionFactory = Factory.define<
  Omit<InvoicePositionsTable, "id">,
  unknown,
  Omit<InvoicePositionsTable, "id"> & { id: number }
>(({ sequence }) => ({
  serviceDate: faker.date.birthdate().toISOString().split("T")[0],
  serviceId: sequence,
  invoiceId: sequence,
  amount: faker.number.int(),
  factor: faker.helpers.arrayElement(["1.0", "1.8", "2.3"]),
})).onCreate(async (invoicePosition) => {
  return await getDb()
    .insertInto("invoicePositions")
    .values(invoicePosition)
    .returningAll()
    .executeTakeFirstOrThrow();
});

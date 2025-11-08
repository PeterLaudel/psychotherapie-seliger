import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import { getDb } from "@/initialize";
import type { InvoicesTable } from "@/db";

export const invoiceFactory = Factory.define<
  Omit<InvoicesTable, "id">,
  unknown,
  Omit<InvoicesTable, "id"> & { id: number }
>(({ sequence }) => ({
  invoiceNumber: `${faker.date
    .birthdate()
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "")}${sequence}`,
  base64Pdf: "data:application/pdf;base64,example",
  invoiceAmount: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
  status: "pending",
})).onCreate(async (invoice) => {
  return await getDb()
    .insertInto("invoices")
    .values({
      invoiceNumber: invoice.invoiceNumber,
      base64Pdf: invoice.base64Pdf,
      invoiceAmount: invoice.invoiceAmount,
      status: invoice.status,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
});

import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import { getDb } from "@/initialize";
import type { Invoice } from "@/models/invoice";


export const invoiceFactory = Factory.define<Omit<Invoice, "id">, unknown, Invoice>(({ sequence }) => ({
  invoiceNumber: `${faker.date
    .birthdate()
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "")}${sequence}`,
  base64Pdf: "data:application/pdf;base64,example",
  name: faker.person.firstName(),
  surname: faker.person.lastName(),
  invoiceAmount: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
  email: faker.internet.email(),
  status: "pending",
})).onCreate(async (invoice) => {
  const result = await getDb()
    .insertInto("invoices")
    .values(
      {
        invoiceNumber: invoice.invoiceNumber,
        base64Pdf: invoice.base64Pdf,
        invoiceAmount: invoice.invoiceAmount,
        status: invoice.status,
      }
    )
    .returning(["id", "invoiceNumber", "base64Pdf", "invoiceAmount"])
    .executeTakeFirstOrThrow();

  return {
    ...result,
    name: invoice.name,
    surname: invoice.surname,
    email: invoice.email,
    invoiceNumber: result.invoiceNumber,
    base64Pdf: result.base64Pdf,
    status: invoice.status,
  }
});

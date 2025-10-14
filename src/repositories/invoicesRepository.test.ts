import { sql } from "kysely";
import timekeeper from "timekeeper";
import { patientFactory } from "../../factories/patient";
import { getDb } from "../initialize";
import { InvoicesRepository } from "./invoicesRepository";
import { invoiceFactory } from "factories/invoice";

describe("InvoicesRepository", () => {
  const invoicesRepository = new InvoicesRepository();

  describe("#create", () => {
    it("creates a new invoice", async () => {
      const patient = await patientFactory.create();
      const invoiceAttributes = invoiceFactory.build({
        invoiceNumber: "202310031",
        name: patient.name,
        surname: patient.surname,
      });

      const createdInvoice = await invoicesRepository.create({
        patientId: patient.id,
        ...invoiceAttributes,
        base64Pdf: "data:application/pdf;base64,example",
      });

      expect(createdInvoice).toEqual({
        id: expect.any(Number),
        ...invoiceAttributes,
        name: patient.name,
        surname: patient.surname,
      });
    });
  });

  describe("#generateInvoiceNumber", () => {
    beforeEach(() => {
      timekeeper.freeze(new Date("2023-10-04T00:00:00Z"));
    });

    afterEach(() => {
      timekeeper.reset();
    });

    it("generates a unique invoice number", async () => {
      // For SQLite, reset the auto-increment value by updating sqlite_sequence table
      await sql`DELETE FROM invoices`.execute(getDb());
      await sql`DELETE FROM sqlite_sequence WHERE name = 'invoices'`.execute(
        getDb(),
      );
      await invoiceFactory.createList(
        3,
        {},
      );

      const invoiceNumber = await invoicesRepository.generateInvoiceNumber();

      expect(invoiceNumber).toEqual("202310044");
    });
  });
});

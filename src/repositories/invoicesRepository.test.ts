import { sql } from "kysely";
import timekeeper from "timekeeper";
import { patientFactory } from "../../factories/patient";
import { serviceFactory } from "../../factories/service";
import { db } from "../initialize";
import { InvoicesRepository } from "./invoicesRepository";
import { invoiceFactory } from "factories/invoice";
import { invoicePositionFactory } from "factories/invoicePosition";

describe("InvoicesRepository", () => {
  const invoicesRepository = new InvoicesRepository();

  describe("#create", () => {
    it("creates a new invoice", async () => {
      const patient = await patientFactory.create();
      const service = await serviceFactory.create();
      const invoiceAttributes = invoiceFactory.build(
        {},
        { associations: { patientId: patient.id } }
      );
      const invoicePositions = invoicePositionFactory.buildList(
        3,
        {},
        {
          associations: { serviceId: service.id },
        }
      );

      const createdInvoice = await invoicesRepository.create({
        ...invoiceAttributes,
        invoicePositions,
      });

      expect(createdInvoice).toEqual({
        id: expect.any(Number),
        ...invoiceAttributes,
        invoicePositions: invoicePositions.map((invoicePosition) => ({
          id: expect.any(Number),
          ...invoicePosition,
          invoiceId: createdInvoice.id,
        })),
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
      await sql`ALTER SEQUENCE invoices_id_seq RESTART WITH 1`.execute(db);
      const patient = await patientFactory.create();
      await invoiceFactory.createList(
        3,
        {},
        { associations: { patientId: patient.id } }
      );

      const invoiceNumber = await invoicesRepository.generateInvoiceNumber();

      expect(invoiceNumber).toEqual("202310044");
    });
  });
});

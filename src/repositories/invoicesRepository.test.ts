import { patientFactory } from "../../factories/patient";
import { serviceFactory } from "../../factories/service";
import { InvoicesRepository } from "./invoicesRepository";
import { invoiceFactory, invoicePositionFactory } from "factories/invoice";

describe("InvoicesRepository", () => {
  const invoicesRepository = new InvoicesRepository();

  describe("#create", () => {
    it("creates a new invoice process", async () => {
      const service = await serviceFactory.create();
      const patient = await patientFactory.create();
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
});

import { invoiceFactory } from "../../factories/invoice";
import { invoicePositionFactory } from "../../factories/invoicePosition";
import { patientFactory } from "../../factories/patient";
import { serviceFactory } from "../../factories/service";
import { InvoicePositionsRepository } from "./invoicePositionsRepository";

describe("InvoicePositionsRepository", () => {
  const invoicePositionsRepository = new InvoicePositionsRepository();

  describe("#create", () => {
    it("creates a new invoice position", async () => {
      const patient = await patientFactory.create();
      const service = await serviceFactory.create();
      const invoice = await invoiceFactory.create(
        {},
        {
          associations: { patientId: patient.id },
        }
      );
      const invoicePositionAttributes = invoicePositionFactory.build(
        {},
        {
          associations: { invoiceId: invoice.id, serviceId: service.id },
        }
      );

      const createdInvoicePosition = await invoicePositionsRepository.create(
        invoicePositionAttributes
      );

      expect(createdInvoicePosition).toEqual({
        id: expect.any(Number),
        ...invoicePositionAttributes,
      });
    });
  });
});

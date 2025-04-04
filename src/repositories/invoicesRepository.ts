import { db } from "@/initialize";
import type { Invoice, InvoicePosition } from "@/models/invoiceProcess";

export type InvoiceCreate = Omit<Invoice, "id" | "status"> & {
  patientId: number;
  invoicePositions: Omit<InvoicePosition, "id" | "invoiceProcessId">[];
};
export class InvoicesRepository {
  constructor(private readonly database = db) {}

  public async create(invoiceProcess: InvoiceCreate): Promise<Invoice> {
    const {
      invoicePositions: createInvoicePositions,
      ...rest
    } = invoiceProcess;
    return await db.transaction().execute(async (trx) => {
      // Step 1: Insert into invoice_processes and get the generated ID
      const { id, patientId } = await trx
        .insertInto("invoices")
        .values({
          patientId: rest.patientId,
        })
        .returning(["id", "patientId"])
        .executeTakeFirstOrThrow();

      const invoicePositions = await Promise.all(
        createInvoicePositions.map(async (invoicePosition) => {
          // Step 2: Insert into invoices using the returned invoiceProcessId
          return await trx
            .insertInto("invoicePositions")
            .values({
              invoiceId: id, // Reference the inserted invoiceProcess
              serviceDate: invoicePosition.serviceDate,
              serviceId: invoicePosition.serviceId,
              factor: invoicePosition.factor,
              amount: invoicePosition.amount,
            })
            .returningAll()
            .executeTakeFirstOrThrow();
        })
      );

      return {
        id,
        patientId,
        invoicePositions,
      };
    });
  }
}

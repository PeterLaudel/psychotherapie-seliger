import { InvoicePosition } from "@/models/invoicePosition";
import { db } from "@/initialize";

export type InvoicePositionCreate = Omit<InvoicePosition, "id">;

export class InvoicePositionsRepository {
  constructor(private readonly database = db) {}

  public async create(
    invoicePosition: InvoicePositionCreate
  ): Promise<InvoicePosition> {
    const result = await this.database
      .insertInto("invoicePositions")
      .values({
        ...invoicePosition,
        pageBreak: invoicePosition.pageBreak ? 1 : 0,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return {
      ...result,
      pageBreak: result.pageBreak === 1, // Convert back to boolean
    };
  }
}

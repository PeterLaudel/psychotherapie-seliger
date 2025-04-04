import { InvoicePosition } from "../models/invoiceProcess";
import { db } from "@/initialize";

export type InvoicePositionCreate = Omit<InvoicePosition, "id">;

export class InvoicePositionsRepository {
  constructor(private readonly database = db) {}

  public async create(
    invoicePosition: InvoicePositionCreate
  ): Promise<InvoicePosition> {
    return await this.database
      .insertInto("invoicePositions")
      .values(invoicePosition)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}

import { InvoicePositionsRepository } from "./invoicePositionsRepository";
import { db } from "@/initialize";
import type { Invoice } from "@/models/invoice";
import type { InvoicePosition } from "@/models/invoicePosition";

export type InvoicePositionCreate = Omit<InvoicePosition, "id" | "invoiceId">;

export type InvoiceCreate = Omit<Invoice, "id"> & {
  patientId: number;
  invoicePositions: InvoicePositionCreate[];
  base64Pdf: string;
};
export class InvoicesRepository {
  constructor(private readonly database = db) {}

  public async create(invoiceProcess: InvoiceCreate): Promise<Invoice> {
    const { invoicePositions: createInvoicePositions, ...rest } =
      invoiceProcess;
    return await this.database.transaction().execute(async (trx) => {
      const invoice = await trx
        .insertInto("invoices")
        .values(rest)
        .returning(["id", "patientId", "invoiceNumber", "base64Pdf"])
        .executeTakeFirstOrThrow();

      const positionRepository = new InvoicePositionsRepository(trx);
      const invoicePositions = await Promise.all(
        createInvoicePositions.map(async (invoicePosition) =>
          positionRepository.create({
            ...invoicePosition,
            invoiceId: invoice.id,
          })
        )
      );

      return {
        ...invoice,
        invoicePositions,
      };
    });
  }

  public async all(): Promise<Invoice[]> {
    return await this.database
      .selectFrom("invoices")
      .selectAll()
      .execute();
  }

  public async generateInvoiceNumber() {
    // For SQLite: get max id and add 1
    const result = await this.database
      .selectFrom("invoices")
      .select(this.database.fn.max("id").as("max_id"))
      .executeTakeFirst();

    const next_id = (result?.max_id ?? 0) + 1;
    const currentDate = new Date();
    const isoDate = currentDate.toISOString().split("T")[0];

    return `${isoDate.replace(/-/g, "")}${next_id}`;
  }
}

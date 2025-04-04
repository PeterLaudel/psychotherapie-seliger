import { sql } from "kysely";
import { InvoicePositionsRepository } from "./invoicePositionsRepository";
import { db } from "@/initialize";
import type { Invoice, InvoicePosition } from "@/models/invoiceProcess";

export type InvoicePositionCreate = Omit<InvoicePosition, "id" | "invoiceId">;

export type InvoiceCreate = Omit<Invoice, "id" | "status"> & {
  patientId: number;
  invoicePositions: InvoicePositionCreate[];
};
export class InvoicesRepository {
  constructor(private readonly database = db) {}

  public async create(invoiceProcess: InvoiceCreate): Promise<Invoice> {
    const {
      invoicePositions: createInvoicePositions,
      ...rest
    } = invoiceProcess;
    return await db.transaction().execute(async (trx) => {
      const { id, patientId } = await trx
        .insertInto("invoices")
        .values({
          patientId: rest.patientId,
        })
        .returning(["id", "patientId"])
        .executeTakeFirstOrThrow();

      const positionRepository = new InvoicePositionsRepository(trx);
      const invoicePositions = await Promise.all(
        createInvoicePositions.map(async (invoicePosition) =>
          positionRepository.create({ ...invoicePosition, invoiceId: id })
        )
      );

      return {
        id,
        patientId,
        invoicePositions,
      };
    });
  }

  public async generateInvoiceNumber() {
    const result = await sql<{
      new_id: number;
    }>`SELECT nextval(pg_get_serial_sequence('invoices', 'id')) AS new_id`.execute(
      db
    );

    const next_id = result.rows[0].new_id;
    const currentDate = new Date();
    const isoDate = currentDate.toISOString().split("T")[0];

    return `${isoDate.replace(/-/g, "")}${next_id}`;
  }
}

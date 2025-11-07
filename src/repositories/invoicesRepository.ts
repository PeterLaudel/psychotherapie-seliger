import { getDb } from "@/initialize";
import type { Invoice } from "@/models/invoice";

export type InvoiceCreate = {
  patientId: number;
  base64Pdf: string;
  invoiceNumber: string;
  invoiceAmount: number;
  status: "pending" | "sent" | "paid";
};

type InvoiceUpdate = {
  id: number;
  base64Pdf: string;
  invoiceAmount: number;
  invoiceNumber: string;
  status: "pending" | "sent" | "paid";
};

type InvoiceSave = InvoiceCreate | InvoiceUpdate;

export class InvoicesRepository {
  constructor(private readonly database = getDb()) {}

  public async save(invoice: InvoiceSave): Promise<Invoice> {
    return await this.database.transaction().execute(async (trx) => {
      const createdInvoice = await this.upsertQuery(invoice, trx);
      if ("id" in invoice === false) {
        await trx
          .insertInto("patientInvoices")
          .values({
            patientId: invoice.patientId,
            invoiceId: createdInvoice.id,
          })
          .executeTakeFirstOrThrow();
      }

      return this.modelSelector(trx)
        .where("invoices.id", "=", createdInvoice.id)
        .executeTakeFirstOrThrow();
    });
  }

  public async find(id: number): Promise<Invoice> {
    return this.modelSelector()
      .where("invoices.id", "=", id)
      .executeTakeFirstOrThrow();
  }

  public async findByInvoiceNumber(invoiceNumber: string): Promise<Invoice> {
    return this.modelSelector()
      .where("invoices.invoiceNumber", "=", invoiceNumber)
      .executeTakeFirstOrThrow();
  }

  public async all(): Promise<Invoice[]> {
    return this.modelSelector().execute();
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

  private modelSelector(transaction: ReturnType<typeof getDb> = this.database) {
    return transaction
      .selectFrom("invoices")
      .innerJoin("patientInvoices", "patientInvoices.invoiceId", "invoices.id")
      .innerJoin("patients", "patients.id", "patientInvoices.patientId")
      .select([
        "patients.name as name",
        "patients.surname as surname",
        "patients.billingEmail as email",
        "invoices.id as id",
        "invoices.invoiceNumber as invoiceNumber",
        "invoices.base64Pdf as base64Pdf",
        "invoices.invoiceAmount as invoiceAmount",
        "invoices.status as status",
      ]);
  }

  private async upsertQuery(
    invoice: InvoiceSave,
    transaction: ReturnType<typeof getDb> = this.database
  ) {
    const data = {
      invoiceNumber: invoice.invoiceNumber,
      base64Pdf: invoice.base64Pdf,
      invoiceAmount: invoice.invoiceAmount,
      status: invoice.status,
    };
    if ("id" in invoice) {
      return transaction
        .updateTable("invoices")
        .where("id", "=", invoice.id)
        .set(data)
        .returningAll()
        .executeTakeFirstOrThrow();
    } else {
      return transaction
        .insertInto("invoices")
        .values(data)
        .returningAll()
        .executeTakeFirstOrThrow();
    }
  }
}

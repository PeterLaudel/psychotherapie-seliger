import { getDb } from "@/initialize";
import type { Invoice } from "@/models/invoice";

export type InvoiceCreate = Omit<
  Invoice,
  "id" | "name" | "surname" | "email"
> & {
  patientId: number;
  base64Pdf: string;
  invoiceAmount: number;
};

export class InvoicesRepository {
  constructor(private readonly database = getDb()) {}

  public async create(invoice: InvoiceCreate): Promise<Invoice> {
    return await this.database.transaction().execute(async (trx) => {
      const createdInvoice = await trx
        .insertInto("invoices")
        .values({
          invoiceNumber: invoice.invoiceNumber,
          base64Pdf: invoice.base64Pdf,
          invoiceAmount: invoice.invoiceAmount,
        })
        .returning(["id", "invoiceNumber", "base64Pdf", "invoiceAmount"])
        .executeTakeFirstOrThrow();

      await trx
        .insertInto("patientInvoices")
        .values({
          patientId: invoice.patientId,
          invoiceId: createdInvoice.id,
        })
        .executeTakeFirstOrThrow();

      const patient = await trx
        .selectFrom("patients")
        .selectAll()
        .where("id", "=", invoice.patientId)
        .executeTakeFirstOrThrow();

      return {
        ...createdInvoice,
        name: patient.name,
        surname: patient.surname,
        email: patient.billingEmail,
      };
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

  private modelSelector() {
    return this.database
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
      ]);
  }
}

import { db } from "@/initialize";
import type { Invoice } from "@/models/invoice";
import type { InvoicePosition } from "@/models/invoicePosition";

export type InvoicePositionCreate = Omit<InvoicePosition, "id" | "invoiceId">;

export type InvoiceCreate = Omit<Invoice, "id" | "name" | "surname"> & {
  patientId: number;
  base64Pdf: string;
};
export class InvoicesRepository {
  constructor(private readonly database = db) { }

  public async create(invoiceProcess: InvoiceCreate): Promise<Invoice> {
    const { ...rest } =
      invoiceProcess;
    return await this.database.transaction().execute(async (trx) => {
      const invoice = await trx
        .insertInto("invoices")
        .values(rest)
        .returning(["id", "patientId", "invoiceNumber", "base64Pdf"])
        .executeTakeFirstOrThrow();

      const patient = await trx
        .selectFrom("patients")
        .selectAll()
        .where("id", "=", rest.patientId)
        .executeTakeFirstOrThrow();

      return {
        ...invoice,
        name: patient.name,
        surname: patient.surname,
      };
    });
  }

  public async all(): Promise<Invoice[]> {
    return await this.database
      .selectFrom("invoices")
      .innerJoin("patients", "invoices.patientId", "patients.id")
      .select([
        "patients.name as name",
        "patients.surname as surname",
        "invoices.id",
        "invoices.invoiceNumber",
        "invoices.base64Pdf",
        "invoices.patientId",
      ])
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

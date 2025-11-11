import { getDb } from "@/initialize";
import { InvoicePosition, type Invoice } from "@/models/invoice";
import { Expression, sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/sqlite";
import { patientSelector } from "./selectors/patient";
import { Patient } from "@/models/patient";
import { serviceSelector } from "./selectors/service";

export type InvoiceSave = Omit<Invoice, "id"> & { id?: number };

export class InvoicesRepository {
  constructor(private readonly database = getDb()) {}

  public async save(invoice: InvoiceSave): Promise<Invoice> {
    return await this.database.transaction().execute(async (trx) => {
      const { id } = await this.upsertInvoice(invoice, trx);
      await this.upsertPatient(id, invoice.patient, trx);
      await this.upsertPositions(id, invoice.positions, trx);

      return this.modelSelector(trx)
        .where("invoices.id", "=", id)
        .executeTakeFirstOrThrow();
    });
  }

  public async find(id: number): Promise<Invoice> {
    return this.modelSelector()
      .where("invoices.id", "=", id)
      .executeTakeFirstOrThrow();
  }

  public async delete(id: number): Promise<void> {
    await this.database
      .deleteFrom("patientInvoices")
      .where("invoiceId", "=", id)
      .execute();
  }

  public async findByInvoiceNumber(invoiceNumber: string): Promise<Invoice> {
    return this.modelSelector()
      .where("invoices.invoiceNumber", "=", invoiceNumber)
      .executeTakeFirstOrThrow();
  }

  public async all(): Promise<Invoice[]> {
    return this.modelSelector(this.database).orderBy("invoiceNumber").execute();
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
      .innerJoin("patientInvoices", "invoices.id", "patientInvoices.invoiceId")
      .innerJoin("patients", "patientInvoices.patientId", "patients.id")
      .select(({ ref }) => [
        "invoices.id as id",
        "invoices.invoiceNumber as invoiceNumber",
        "invoices.base64Pdf as base64Pdf",
        "invoices.invoiceAmount as invoiceAmount",
        "invoices.status as status",
        this.selectPositions(ref("invoices.id"))
          .$castTo<InvoicePosition[]>()
          .as("positions"),
        jsonObjectFrom(
          patientSelector(this.database).whereRef(
            "patients.id",
            "=",
            ref("patientInvoices.patientId")
          )
        )
          .$notNull()
          .as("patient"),
      ]);
  }

  private async upsertInvoice(
    invoice: InvoiceSave,
    transaction: ReturnType<typeof getDb> = this.database
  ) {
    const data = {
      invoiceNumber: invoice.invoiceNumber,
      base64Pdf: invoice.base64Pdf,
      invoiceAmount: invoice.invoiceAmount,
      status: invoice.status,
    };
    if (invoice.id) {
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
  private async upsertPatient(
    invoiceId: number,
    patient: Patient,
    transaction: ReturnType<typeof getDb> = this.database
  ) {
    await transaction
      .deleteFrom("patientInvoices")
      .where("patientInvoices.invoiceId", "=", invoiceId)
      .execute();

    await transaction
      .insertInto("patientInvoices")
      .values({
        invoiceId: invoiceId,
        patientId: patient.id,
      })
      .execute();
  }

  private selectPositions(invoiceId: Expression<number>) {
    return jsonArrayFrom(
      this.database
        .selectFrom("invoicePositions")
        .select(({ ref }) => [
          "invoicePositions.serviceDate as serviceDate",
          sql<boolean>`invoicePositions.pageBreak != 0`.as("pageBreak"),
          "invoicePositions.amount as amount",
          "invoicePositions.factor as factor",
          this.selectService(ref("invoicePositions.serviceId"))
            .$notNull()
            .as("service"),
        ])
        .whereRef("invoicePositions.invoiceId", "=", invoiceId)
    );
  }

  private selectService(serviceId: Expression<number>) {
    return jsonObjectFrom(
      serviceSelector(this.database).whereRef(serviceId, "=", "services.id")
    );
  }

  private async upsertPositions(
    invoiceId: number,
    positions: InvoicePosition[],
    transaction = this.database
  ) {
    await transaction
      .deleteFrom("invoicePositions")
      .where("invoicePositions.invoiceId", "=", invoiceId)
      .execute();

    return Promise.all(
      positions.map((position) =>
        transaction
          .insertInto("invoicePositions")
          .values({
            serviceId: position.service.id,
            serviceDate: position.serviceDate,
            amount: position.amount,
            factor: position.factor,
            pageBreak: Number(position.pageBreak),
            invoiceId: invoiceId,
          })
          .execute()
      )
    );
  }
}

import { Database as DatabaseDescription } from "@/db";
import { type Database } from "@/initialize";

type DatabaseRecord = Record<keyof DatabaseDescription, undefined>;

export async function clearSqliteDatabase(
  database: Database
) {
  const allRecords: DatabaseRecord = {
    invoicePositions: undefined,
    invoices: undefined,
    patientInvoices: undefined,
    serviceAmounts: undefined,
    services: undefined,
    patients: undefined,
    therapeuts: undefined,
  };

  const tables: {name: keyof DatabaseRecord}[] = Object.keys(allRecords).map((key) => ({
    name: key,
  })) as {name: keyof DatabaseRecord}[];


  for (const { name } of tables) {
    await database.deleteFrom(name).execute();
  }
}

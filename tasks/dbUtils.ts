import { Database as DatabaseDescription } from "@/db";

import { clearDatabase as clearDatabaseOrigin } from "@/database";
import { getDb } from "@/initialize";

type DatabaseRecord = Record<keyof DatabaseDescription, undefined>;

export async function clearDatabase() {
  const allRecords: DatabaseRecord = {
    invoicePositions: undefined,
    invoices: undefined,
    patientInvoices: undefined,
    serviceAmounts: undefined,
    services: undefined,
    patients: undefined,
    therapeuts: undefined,
  };

  const tables: (keyof DatabaseRecord)[] = Object.keys(
    allRecords,
  ) as (keyof DatabaseRecord)[];
  const db = await getDb();
  await clearDatabaseOrigin(db, tables);
}

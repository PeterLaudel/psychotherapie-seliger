import { clearDatabase as clearDatabaseOrigin } from "@/database";
import { getDb } from "@/initialize";

export async function clearDatabase() {
  const db = getDb();
  await clearDatabaseOrigin(db);
}

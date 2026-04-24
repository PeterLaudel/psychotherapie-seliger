import { getDb } from "@/initialize";
import { clearSqliteDatabase } from "./tasks/dbUtils";

beforeEach(async () => {
  const db = await getDb();
  await clearSqliteDatabase(db);
});

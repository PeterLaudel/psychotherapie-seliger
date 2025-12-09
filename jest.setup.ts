import { getDb } from "@/initialize";
import { clearSqliteDatabase } from "./tasks/dbUtils";

beforeEach(async () => {
  await clearSqliteDatabase(getDb());
});

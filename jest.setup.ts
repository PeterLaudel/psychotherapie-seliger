import { db } from "./src/initialize";
import { clearSqliteDatabase } from "tasks/dbUtils";

beforeEach(async () => {
  await clearSqliteDatabase(db);
});
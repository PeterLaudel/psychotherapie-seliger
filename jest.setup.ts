import { getDb } from "./src/initialize";
import { clearSqliteDatabase } from "./tasks/dbUtils";

beforeEach(async () => {
  await clearSqliteDatabase(getDb());
});

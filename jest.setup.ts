import { getDb } from "./src/initialize";
import { clearDatabase } from "tasks/dbUtils";


afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  const db = await getDb();
  await db.destroy();
});

import { TherapeutRepository } from "@/repositories/therapeutRepository";
import { getDb } from "@/initialize";

export async function getTherapeutsRepository() {
  const db = await getDb();
  return new TherapeutRepository(db);
}

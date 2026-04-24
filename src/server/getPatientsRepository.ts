import { PatientsRepository } from "@/repositories/patientsRepository";
import { getDb } from "@/initialize";

export async function getPatientsRepository() {
  const db = await getDb();
  return new PatientsRepository(db);
}

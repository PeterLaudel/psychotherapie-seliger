import ServicesRepository from "@/repositories/servicesRepository";
import { getDb } from "@/initialize";

export async function getServicesRepository(): Promise<ServicesRepository> {
  const db = await getDb();
  return new ServicesRepository(db);
}

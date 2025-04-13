import { PatientsRepository } from "@/repositories/patientsRepository";

export async function getPatientsRepository() {
  return Promise.resolve(new PatientsRepository());
}

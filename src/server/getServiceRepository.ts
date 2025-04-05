import ServicesRepository from "@/repositories/servicesRepository";

export function getServicesRepository(): ServicesRepository {
  return new ServicesRepository();
}

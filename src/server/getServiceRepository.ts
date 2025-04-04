import ServicesRepository from "@/repositories/servicesRepositories";

export function getServicesRepository(): ServicesRepository {
  return new ServicesRepository();
}

import ServicesRepository from "@/repositories/servicesRepository";

export function getServicesRepository(): Promise<ServicesRepository> {
  return Promise.resolve(new ServicesRepository());
}

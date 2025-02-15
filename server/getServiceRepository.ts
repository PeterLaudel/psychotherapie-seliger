import { ServicesRepository } from "../repositories/services";

export function getServicesRepository(): ServicesRepository {
  return new ServicesRepository();
}

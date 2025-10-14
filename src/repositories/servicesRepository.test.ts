import { getDb } from "@/initialize";
import ServicesRepository from "./servicesRepository";
import { serviceFactory } from "factories/service";

describe("ServicesRepository", () => {
  describe("#all", () => {
    it("returns a list of all services", async () => {
      const service = await serviceFactory.create();

      const servicesRepository = new ServicesRepository();
      const services = await servicesRepository.all();

      expect(services).toEqual([service]);
    });
  });

  describe("#find", () => {
    it("finds the right service", async () => {
      await serviceFactory.create();
      const createdService = await serviceFactory.create();

      const servicesRepository = new ServicesRepository();
      const sercive = await servicesRepository.find(createdService.id);

      expect(createdService).toEqual(sercive);
    });
  });

  describe("#save", () => {
    it("creates a service when no id is provided", async () => {
      const service = serviceFactory.build();
      const database = getDb();
      const servicesRepository = new ServicesRepository(database);

      const result = await servicesRepository.save(service);

      const allServices = await database
        .selectFrom("services")
        .selectAll()
        .execute();
      expect(allServices.length).toEqual(1);
      expect(result).toEqual({ ...service, id: expect.any(Number) });
    });

    it("updates a service when id is provided", async () => {
      const service = await serviceFactory.create();
      const servicesRepository = new ServicesRepository();

      const result = await servicesRepository.save({
        ...service,
        description: "New Description",
      });

      expect(result).toEqual({ ...service, description: "New Description" });
    });
  });
});

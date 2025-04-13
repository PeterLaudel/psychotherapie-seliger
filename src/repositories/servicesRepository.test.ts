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
});

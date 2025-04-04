import { PatientsRepository } from "./patientsRepository";
import { patientFactory } from "factories/patient";

describe("PatientsRepository", () => {
  const patientRepository = new PatientsRepository();

  describe("#all", () => {
    it("returns a list of all patients", async () => {
      const createdPatients = await patientFactory.createList(3);

      const patients = await patientRepository.all();

      expect(new Set(patients)).toEqual(new Set(createdPatients));
    });
  });

  describe("#create", () => {
    it("creates a new patient", async () => {
      const patientAttributes = patientFactory.build();

      const patient = await patientRepository.create(patientAttributes);

      expect(patient).toEqual({
        id: expect.any(Number),
        ...patientAttributes,
      });
    });
  });
});

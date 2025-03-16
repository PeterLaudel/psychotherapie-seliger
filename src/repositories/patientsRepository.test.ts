import { PatientsRepository } from "./patientsRepository";
import { patientFactory } from "factories/patient";

describe("PatientsRepository", () => {
  const patientRepository = new PatientsRepository();

  describe("#get", () => {
    it("returns a list of all patients", async () => {
      const createdPatients = await patientFactory.createList(3);

      const patients = await patientRepository.get();

      expect(new Set(patients)).toEqual(new Set(createdPatients));
    });
  });

  describe("#create", () => {
    it("creates a new patient", async () => {
      const patient = patientFactory.build();

      const {
        id: createdId,
        ...createdPatient
      } = await patientRepository.create(patient);

      expect(createdId).toBeDefined();
      expect(createdPatient).toEqual(patient);
    });
  });
});

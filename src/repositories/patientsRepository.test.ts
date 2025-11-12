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

  describe("#find", () => {
    it("returns a patient by id", async () => {
      const patient = await patientFactory.create();

      const foundPatient = await patientRepository.find(patient.id);

      expect(foundPatient).toEqual(patient);
    });

    it("throws an error if the patient does not exist", async () => {
      await expect(patientRepository.find(999)).rejects.toThrow();
    });
  });

  describe("#save", () => {
    it("creates a new patient", async () => {
      const patientAttributes = patientFactory.build();

      const patient = await patientRepository.save(patientAttributes);

      expect(patient).toEqual({
        id: expect.any(Number),
        ...patientAttributes,
      });
    });

    it("updates an existing patient", async () => {
      const patient = await patientFactory.create();

      const updatedPatient = await patientRepository.save({
        ...patient,
        diagnosis: "nono",
      });

      expect(updatedPatient).toEqual({
        ...patient,
        id: patient.id,
        diagnosis: "nono",
      });
    });
  });
});

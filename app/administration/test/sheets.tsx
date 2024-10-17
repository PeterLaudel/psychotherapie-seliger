import { getPatientRepository } from "../../../server";

export default async function Sheets() {
  const patientRepository = await getPatientRepository();

  return (await patientRepository.get()).map((patient) => {
    return <div key={patient.id}>{`${patient.name} ${patient.surname}`}</div>;
  });
}

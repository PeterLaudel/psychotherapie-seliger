import Section from "../../../../components/section";
import { getPatientsRepository } from "../../../../server";

interface Props {
  params: {
    patientId: number;
  };
}

export default async function Page({ params }: Props) {
  const { patientId } = params;

  const patientRepository = await getPatientsRepository();
  const patient = await patientRepository.find(patientId);

  return (
    <div className="m-4">
      <h1>Patient</h1>
      <Section>
        <h2>
          {patient.name} {patient.surname}
        </h2>
        <p>{patient.email}</p>
        <p>{patient.birthdate}</p>
        <p>{patient.address.street}</p>
        <p>
          {patient.address.zip} {patient.address.city}
        </p>
      </Section>
    </div>
  );
}

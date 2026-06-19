import { getPatientsRepository } from "@/server";
import SessionFormShell from "../_forms/sessionFormShell";

interface Props {
  searchParams: Promise<{ patientId?: string }>;
}

export default async function Page(props: Props) {
  const { patientId } = await props.searchParams;
  const patientsRepo = await getPatientsRepository();
  const patients = await patientsRepo.all();

  return (
    <div className="m-4 grid gap-4 grid-flow-row h-fit">
      <h1>Sitzung dokumentieren</h1>
      <SessionFormShell
        patients={patients}
        lockedPatientId={patientId ? Number(patientId) : undefined}
      />
    </div>
  );
}

import { getSessionsRepository, getPatientsRepository } from "@/server";
import SessionFormShell from "../_forms/sessionFormShell";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page(props: Props) {
  const { id } = await props.params;

  const [sessionsRepo, patientsRepo] = await Promise.all([
    getSessionsRepository(),
    getPatientsRepository(),
  ]);

  const [session, patients] = await Promise.all([
    sessionsRepo.find(Number(id)),
    patientsRepo.all(),
  ]);

  return (
    <div className="m-4 grid gap-4 grid-flow-row h-fit">
      <h1>
        Sitzung {session.sessionNumber} — {session.patient.name} {session.patient.surname}
      </h1>
      <SessionFormShell
        patients={patients}
        lockedPatientId={session.patientId}
        initialSession={session}
      />
    </div>
  );
}

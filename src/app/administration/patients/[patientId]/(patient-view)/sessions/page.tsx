import { getSessionsRepository } from "@/server";
import PatientSessionsList from "../../sessions/patientSessionsList";

interface Props {
  params: Promise<{ patientId: string }>;
}

export default async function Page(props: Props) {
  const { patientId } = await props.params;

  const sessionsRepository = await getSessionsRepository();
  const { rows: sessions } = await sessionsRepository.filter({
    patientId: Number(patientId),
  });

  return <PatientSessionsList patientId={patientId} initialSessions={sessions} />;
}

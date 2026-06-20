import { getSessionsRepository } from "@/server";
import SessionFormShell from "../_forms/sessionFormShell";

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function Page(props: Props) {
  const { sessionId } = await props.params;
  const sessionsRepo = await getSessionsRepository();
  const session = await sessionsRepo.find(Number(sessionId));

  return (
    <div className="m-4 grid gap-4 grid-flow-row h-fit">
      <h1>
        Sitzung {session.sessionNumber} — {session.patient.name}{" "}
        {session.patient.surname}
      </h1>
      <SessionFormShell initialSession={session} />
    </div>
  );
}

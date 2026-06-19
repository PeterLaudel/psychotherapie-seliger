import { getSessionsRepository } from "@/server";
import DocumentationDashboard from "./documentationDashboard";

export default async function Page() {
  const sessionsRepo = await getSessionsRepository();
  const { rows: sessions } = await sessionsRepo.filter({ pageSize: 100 });

  return <DocumentationDashboard initialSessions={sessions} />;
}

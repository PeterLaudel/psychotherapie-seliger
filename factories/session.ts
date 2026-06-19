import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import { Insertable, Selectable } from "kysely";
import { getDb } from "@/initialize";
import { SessionsTable } from "@/db";
import { patientFactory } from "./patient";

type SessionBuild = Omit<Insertable<SessionsTable>, "id" | "createdAt">;
type SessionCreated = Selectable<SessionsTable>;

export const sessionFactory = Factory.define<SessionBuild, unknown, SessionCreated>(
  ({ sequence }) => ({
    patientId: sequence,
    therapeutId: null,
    sessionDate: faker.date.recent({ days: 60 }).toISOString().split("T")[0],
    sessionNumber: sequence,
    durationMinutes: 50,
    sessionType: "Einzelgespräch",
    phase: null,
    moodStart: null,
    moodEnd: null,
    riskLevel: null,
    interventions: "[]",
    clinicalNotes: null,
    nextSessionPlan: null,
    status: "draft",
    deletedAt: null,
  })
).onCreate(async (attrs) => {
  const patient = await patientFactory.create();
  return await getDb()
    .insertInto("sessions")
    .values({ ...attrs, patientId: patient.id } as Insertable<SessionsTable>)
    .returningAll()
    .executeTakeFirstOrThrow() as unknown as SessionCreated;
});

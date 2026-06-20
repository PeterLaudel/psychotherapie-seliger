import { Database } from "@/initialize";
import { Session } from "@/models/session";
import { sessionSelector } from "./selectors/session";
import { Patient } from "@/models/patient";

export type SessionSave = Omit<Session, "id" | "createdAt" | "interventions"> & {
  id?: number;
  interventions: string[];
};

export class SessionsRepository {
  constructor(private readonly database: Database) {}

  async find(id: number): Promise<Session> {
    return await sessionSelector(this.database)
      .where("sessions.id", "=", id)
      .where("sessions.deletedAt", "is", null)
      .executeTakeFirstOrThrow() as unknown as Session;
  }

  async filter({
    patientId,
    page = 0,
    pageSize = 50,
  }: {
    patientId?: number;
    page?: number;
    pageSize?: number;
  }): Promise<{ rows: Session[]; total: number }> {
    let query = sessionSelector(this.database)
      .where("sessions.deletedAt", "is", null);

    if (patientId !== undefined) {
      query = query.where("sessions.patientId", "=", patientId);
    }

    const [rawRows, countResult] = await Promise.all([
      query
        .orderBy("sessions.sessionDate", "desc")
        .orderBy("sessions.id", "desc")
        .limit(pageSize)
        .offset(page * pageSize)
        .$castTo<Session>()
        .execute(),
      this.database
        .selectFrom("sessions")
        .select(this.database.fn.countAll<number>().as("total"))
        .where("sessions.deletedAt", "is", null)
        .$if(patientId !== undefined, (qb) => qb.where("sessions.patientId", "=", patientId!))
        .executeTakeFirstOrThrow(),
    ]);

    return { rows: rawRows, total: Number(countResult.total) };
  }

  async nextSessionNumber(patient: Pick<Patient, "id">): Promise<number> {
    const result = await this.database
      .selectFrom("sessions")
      .select(this.database.fn.max("sessionNumber").as("max"))
      .where("sessions.patientId", "=", patient.id)
      .executeTakeFirst();

    return (result?.max ?? 0) + 1;
  }

  async save(session: SessionSave): Promise<Session> {
    const { id: originId, interventions, ...rest } = session;
    const data = { ...rest, interventions: JSON.stringify(interventions), patientId: rest.patient.id };

    const { id } = originId
      ? await this.database
          .updateTable("sessions")
          .set(data)
          .returning(["id"])
          .where("sessions.id", "=", originId)
          .executeTakeFirstOrThrow()
      : await this.database
          .insertInto("sessions")
          .values(data)
          .returning(["id"])
          .executeTakeFirstOrThrow();

    return this.find(id);
  }

  async softDelete(id: number): Promise<void> {
    await this.database
      .updateTable("sessions")
      .set({ deletedAt: new Date().toISOString() })
      .where("sessions.id", "=", id)
      .execute();
  }
}

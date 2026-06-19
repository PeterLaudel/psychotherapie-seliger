import { getDb } from "@/initialize";
import { SessionsRepository } from "./sessionsRepository";
import { sessionFactory } from "factories/session";
import { patientFactory } from "factories/patient";

describe("SessionsRepository", () => {
  let sessionsRepository: SessionsRepository;

  beforeEach(() => {
    sessionsRepository = new SessionsRepository(getDb());
  });

  describe("#find", () => {
    it("returns a session by id", async () => {
      const row = await sessionFactory.create();

      const found = await sessionsRepository.find(row.id);

      expect(found).toMatchObject({
        id: row.id,
        patientId: row.patientId,
        sessionDate: row.sessionDate,
        sessionNumber: row.sessionNumber,
        status: row.status,
        interventions: row.interventions as unknown as string[],
        patient: expect.objectContaining({ id: row.patientId }),
      });
    });

    it("throws when the session does not exist", async () => {
      await expect(sessionsRepository.find(999)).rejects.toThrow();
    });

    it("throws when the session is soft-deleted", async () => {
      const session = await sessionFactory.create();
      await sessionsRepository.softDelete(session.id);

      await expect(sessionsRepository.find(session.id)).rejects.toThrow();
    });
  });

  describe("#filter", () => {
    it("returns all non-deleted sessions when no filter is given", async () => {
      const sessions = await sessionFactory.createList(3);

      const { rows, total } = await sessionsRepository.filter({});

      expect(total).toBe(3);
      expect(rows.map((s) => s.id)).toEqual(
        expect.arrayContaining(sessions.map((s) => s.id))
      );
    });

    it("filters by patientId", async () => {
      const target = await sessionFactory.create();
      await sessionFactory.create(); // different patient

      const { rows, total } = await sessionsRepository.filter({
        patientId: target.patientId,
      });

      expect(total).toBe(1);
      expect(rows[0].id).toBe(target.id);
    });

    it("excludes soft-deleted sessions", async () => {
      const kept = await sessionFactory.create();
      const deleted = await sessionFactory.create();
      await sessionsRepository.softDelete(deleted.id);

      const { rows, total } = await sessionsRepository.filter({});

      expect(total).toBe(1);
      expect(rows[0].id).toBe(kept.id);
    });

    it("returns rows ordered by sessionDate descending", async () => {
      const patient = await patientFactory.create();
      const db = getDb();

      await db
        .insertInto("sessions")
        .values([
          { patientId: patient.id, sessionDate: "2024-01-01", sessionNumber: 1, interventions: "[]", sessionType: "Einzelgespräch", status: "draft" },
          { patientId: patient.id, sessionDate: "2024-03-01", sessionNumber: 2, interventions: "[]", sessionType: "Einzelgespräch", status: "draft" },
          { patientId: patient.id, sessionDate: "2024-02-01", sessionNumber: 3, interventions: "[]", sessionType: "Einzelgespräch", status: "draft" },
        ])
        .execute();

      const { rows } = await sessionsRepository.filter({ patientId: patient.id });

      expect(rows.map((r) => r.sessionDate)).toEqual([
        "2024-03-01",
        "2024-02-01",
        "2024-01-01",
      ]);
    });
  });

  describe("#nextSessionNumber", () => {
    it("returns 1 when the patient has no sessions", async () => {
      const patient = await patientFactory.create();

      const next = await sessionsRepository.nextSessionNumber(patient.id);

      expect(next).toBe(1);
    });

    it("returns one more than the current highest session number", async () => {
      const session = await sessionFactory.create();
      await getDb()
        .updateTable("sessions")
        .set({ sessionNumber: 5 })
        .where("id", "=", session.id)
        .execute();

      const next = await sessionsRepository.nextSessionNumber(session.patientId);

      expect(next).toBe(6);
    });
  });

  describe("#save", () => {
    it("creates a new session", async () => {
      const patient = await patientFactory.create();

      const session = await sessionsRepository.save({
        patientId: patient.id,
        therapeutId: null,
        sessionDate: "2024-06-01",
        sessionNumber: 1,
        durationMinutes: 50,
        sessionType: "Einzelgespräch",
        phase: null,
        moodStart: null,
        moodEnd: null,
        riskLevel: null,
        interventions: [],
        clinicalNotes: null,
        nextSessionPlan: null,
        status: "draft",
        deletedAt: null,
      });

      expect(session).toMatchObject({
        id: expect.any(Number),
        patientId: patient.id,
        sessionDate: "2024-06-01",
        sessionNumber: 1,
        status: "draft",
        interventions: [],
      });
    });

    it("persists interventions as a JSON array", async () => {
      const patient = await patientFactory.create();
      const interventions = ["Psychoedukation", "EMDR"];

      const session = await sessionsRepository.save({
        patientId: patient.id,
        therapeutId: null,
        sessionDate: "2024-06-01",
        sessionNumber: 1,
        durationMinutes: 50,
        sessionType: "Einzelgespräch",
        phase: null,
        moodStart: null,
        moodEnd: null,
        riskLevel: null,
        interventions,
        clinicalNotes: null,
        nextSessionPlan: null,
        status: "draft",
        deletedAt: null,
      });

      expect(session.interventions).toEqual(interventions);
    });

    it("updates an existing session", async () => {
      const row = await sessionFactory.create();

      const updated = await sessionsRepository.save({
        ...row,
        interventions: row.interventions as unknown as string[],
        riskLevel: "high",
        status: "final",
      } as import("./sessionsRepository").SessionSave);

      expect(updated).toMatchObject({
        id: row.id,
        riskLevel: "high",
        status: "final",
      });
    });
  });

  describe("#softDelete", () => {
    it("sets deletedAt and hides the session from find and filter", async () => {
      const session = await sessionFactory.create();

      await sessionsRepository.softDelete(session.id);

      await expect(sessionsRepository.find(session.id)).rejects.toThrow();
      const { total } = await sessionsRepository.filter({
        patientId: session.patientId,
      });
      expect(total).toBe(0);
    });

    it("records a non-null deletedAt timestamp in the DB", async () => {
      const session = await sessionFactory.create();

      await sessionsRepository.softDelete(session.id);

      const row = await getDb()
        .selectFrom("sessions")
        .select("deletedAt")
        .where("id", "=", session.id)
        .executeTakeFirstOrThrow();
      expect(row.deletedAt).not.toBeNull();
    });
  });
});

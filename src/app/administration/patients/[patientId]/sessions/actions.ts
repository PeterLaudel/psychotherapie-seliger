"use server";

import { getPatientsRepository, getSessionsRepository } from "@/server";
import { Session } from "@/models/session";

export async function createSession(patientId: number): Promise<Session> {
  const patientRepository = await getPatientsRepository();
  const patient = await patientRepository.find(patientId);

  const repo = await getSessionsRepository();
  const sessionNumber = await repo.nextSessionNumber(patient);

  return repo.save({
    patient,
    therapeutId: null,
    sessionDate: new Date().toISOString().slice(0, 10),
    sessionNumber,
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
}

export async function updateSession(
  id: number,
  data: Partial<Session>,
): Promise<Session> {
  const repo = await getSessionsRepository();
  const existing = await repo.find(id);
  return repo.save({ ...existing, ...data });
}

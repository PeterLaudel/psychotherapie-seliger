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
  return repo.save({
    ...existing,
    id,
    sessionDate: data.sessionDate ?? existing.sessionDate,
    durationMinutes: data.durationMinutes ?? existing.durationMinutes,
    sessionType: data.sessionType ?? existing.sessionType,
    status: data.status ?? existing.status,
    therapeutId:
      data.therapeutId !== undefined ? data.therapeutId : existing.therapeutId,
    phase: data.phase !== undefined ? data.phase : existing.phase,
    moodStart:
      data.moodStart !== undefined ? data.moodStart : existing.moodStart,
    moodEnd: data.moodEnd !== undefined ? data.moodEnd : existing.moodEnd,
    riskLevel:
      data.riskLevel !== undefined ? data.riskLevel : existing.riskLevel,
    interventions: data.interventions ?? existing.interventions,
    clinicalNotes:
      data.clinicalNotes !== undefined
        ? data.clinicalNotes
        : existing.clinicalNotes,
    nextSessionPlan:
      data.nextSessionPlan !== undefined
        ? data.nextSessionPlan
        : existing.nextSessionPlan,
  });
}

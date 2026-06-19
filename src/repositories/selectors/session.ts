import { type Database } from "@/initialize";
import { jsonObjectFrom } from "@/database";
import { patientSelector } from "./patient";

export function sessionSelector(database: Database) {
  return database
    .selectFrom("sessions")
    .select([
      "sessions.id",
      "sessions.patientId",
      "sessions.therapeutId",
      "sessions.sessionDate",
      "sessions.sessionNumber",
      "sessions.durationMinutes",
      "sessions.sessionType",
      "sessions.phase",
      "sessions.moodStart",
      "sessions.moodEnd",
      "sessions.riskLevel",
      "sessions.interventions",
      "sessions.clinicalNotes",
      "sessions.nextSessionPlan",
      "sessions.status",
      "sessions.deletedAt",
      "sessions.createdAt",
    ])
    .select(({ ref }) => [
      jsonObjectFrom(
        patientSelector(database).whereRef("patients.id", "=", ref("sessions.patientId"))
      )
        .$notNull()
        .as("patient"),
    ]);
}

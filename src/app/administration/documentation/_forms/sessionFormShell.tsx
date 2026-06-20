"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Patient } from "@/models/patient";
import { Session } from "@/models/session";
import { createSession, updateSession } from "../actions";
import SessionForm from "./sessionForm";

export type SessionFormValues = {
  sessionDate: string;
  durationMinutes: number;
  sessionType: string;
  phase: string;
  moodStart: number | null;
  moodEnd: number | null;
  riskLevel: string;
  interventions: string[];
  clinicalNotes: string;
  nextSessionPlan: string;
};

function toFormValues(session: Session): SessionFormValues {
  return {
    sessionDate: session.sessionDate,
    durationMinutes: session.durationMinutes,
    sessionType: session.sessionType,
    phase: session.phase ?? "",
    moodStart: session.moodStart,
    moodEnd: session.moodEnd,
    riskLevel: session.riskLevel ?? "",
    interventions: session.interventions,
    clinicalNotes: session.clinicalNotes ?? "",
    nextSessionPlan: session.nextSessionPlan ?? "",
  };
}

function toSessionPayload(values: SessionFormValues): Partial<Session> {
  return {
    ...values,
    sessionType: values.sessionType as Session["sessionType"],
    phase: (values.phase as Session["phase"]) || null,
    riskLevel: (values.riskLevel as Session["riskLevel"]) || null,
    clinicalNotes: values.clinicalNotes || null,
    nextSessionPlan: values.nextSessionPlan || null,
  };
}

const defaultFormValues: SessionFormValues = {
  sessionDate: new Date().toISOString().slice(0, 10),
  durationMinutes: 50,
  sessionType: "Einzelgespräch",
  phase: "",
  moodStart: null,
  moodEnd: null,
  riskLevel: "",
  interventions: [],
  clinicalNotes: "",
  nextSessionPlan: "",
};

interface Props {
  patients: Patient[];
  lockedPatientId?: number;
  initialSession?: Session;
}

export default function SessionFormShell({
  patients,
  lockedPatientId,
  initialSession,
}: Props) {
  const [session, setSession] = useState<Session | null>(initialSession ?? null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const methods = useForm<SessionFormValues>({
    defaultValues: initialSession ? toFormValues(initialSession) : defaultFormValues,
  });

  useEffect(() => {
    if (initialSession || !lockedPatientId) return;
    void createSession(lockedPatientId).then((s) => {
      setSession(s);
      setSaveStatus("saved");
    });
  }, [initialSession, lockedPatientId]);

  useEffect(() => {
    if (!session) return;
    // eslint-disable-next-line react-hooks/incompatible-library -- RHF watch() is intentionally used outside render; subscription is cleaned up on unmount
    const subscription = methods.watch(() => {
      setSaveStatus("saving");
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        const values = methods.getValues();
        await updateSession(session.id, toSessionPayload(values));
        setSaveStatus("saved");
      }, 2500);
    });
    return () => subscription.unsubscribe();
  }, [session, methods]);

  const handleFinalize = useCallback(async () => {
    if (!session) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const values = methods.getValues();
    const updated = await updateSession(session.id, {
      ...toSessionPayload(values),
      status: "final",
    });
    setSession(updated);
    setSaveStatus("saved");
  }, [session, methods]);

  if (!session && lockedPatientId) {
    return <p className="text-gray-500">Sitzung wird vorbereitet…</p>;
  }

  return (
    <FormProvider {...methods}>
      <SessionForm
        patients={patients}
        lockedPatientId={lockedPatientId}
        session={session}
        saveStatus={saveStatus}
        onFinalize={handleFinalize}
        onPatientSelected={
          session
            ? undefined
            : (patientId) => {
                void createSession(patientId).then((s) => {
                  setSession(s);
                  setSaveStatus("saved");
                });
              }
        }
      />
    </FormProvider>
  );
}

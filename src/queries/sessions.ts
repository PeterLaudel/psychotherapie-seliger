import { Session } from "@/models/session";

export interface SessionsQueryKey {
  patientId?: number;
  page?: number;
  pageSize?: number;
}

export interface SessionsResult {
  rows: Session[];
  total: number;
}

export const sessionsQueryKey = (query: SessionsQueryKey = {}) =>
  ["sessions", query] as const;

export const sessionQueryKey = (id: number) => ["sessions", id] as const;

export async function fetchSessions(query: SessionsQueryKey = {}): Promise<SessionsResult> {
  const url = new URLSearchParams();
  if (query.patientId !== undefined) url.set("patientId", String(query.patientId));
  if (query.page !== undefined) url.set("page", String(query.page));
  if (query.pageSize !== undefined) url.set("pageSize", String(query.pageSize));
  const res = await fetch(`/api/sessions?${url}`);
  if (!res.ok) throw new Error("Failed to fetch sessions");
  return res.json();
}

export async function fetchSession(id: number): Promise<Session> {
  const res = await fetch(`/api/sessions/${id}`);
  if (!res.ok) throw new Error("Failed to fetch session");
  return res.json();
}

export async function createSession(data: Partial<Session>): Promise<Session> {
  const res = await fetch("/api/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create session");
  return res.json();
}

export async function updateSession(id: number, data: Partial<Session>): Promise<Session> {
  const res = await fetch(`/api/sessions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update session");
  return res.json();
}

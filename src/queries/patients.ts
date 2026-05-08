import { Patient } from "@/models/patient";

export const patientsQueryKey = (search = "") => ["patients", search] as const;

export async function fetchPatients(search = ""): Promise<Patient[]> {
  const url = new URLSearchParams();
  if (search) url.set("search", search);
  const res = await fetch(`/api/patients?${url}`);
  if (!res.ok) throw new Error("Failed to fetch patients");
  return res.json();
}

import { people_v1 } from "@googleapis/people";
import PatientsRepository from "../repositories/patients";
import { getAuthClient } from "./getAuthClient";

export async function getPatientsRepository(): Promise<PatientsRepository> {
  const auth = await getAuthClient();
  const peopleClient = new people_v1.People({ auth });
  return new PatientsRepository(peopleClient);
}

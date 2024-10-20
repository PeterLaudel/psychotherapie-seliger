import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/config";
import { OAuth2Client } from "google-auth-library";
import { people_v1 } from "@googleapis/people";
import { PatientRepository } from "../repositories/patients";
import { ServiceRepository } from "../repositories/services";

const getToken = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("No session found");
  }
  return session.accessToken;
};

const getAuthClient = async () => {
  const token = await getToken();
  const oAuthClient = new OAuth2Client();
  oAuthClient.setCredentials({
    access_token: token,
  });
  return oAuthClient;
};

export async function getPatientRepository() {
  const auth = await getAuthClient();
  const peopleClient = new people_v1.People({ auth });
  return new PatientRepository(peopleClient);
}

export async function getServicesRepository() {
  return new ServiceRepository();
}

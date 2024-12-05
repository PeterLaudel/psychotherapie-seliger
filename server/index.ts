import { getServerSession } from "next-auth";
import { OAuth2Client } from "google-auth-library";
import { people_v1 } from "@googleapis/people";
import { drive_v3 } from "@googleapis/drive";
import { authOptions } from "../app/api/auth/[...nextauth]/config";
import { PatientsRepository } from "../repositories/patients";
import { ServicesRepository } from "../repositories/services";
import { InvoicesRepository } from "../repositories/invoices";

const getToken = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("No session found");
  }
  return session.accessToken;
};

export const getAuthClient = async () => {
  const token = await getToken();
  const oAuthClient = new OAuth2Client();
  oAuthClient.setCredentials({
    access_token: token,
  });
  return oAuthClient;
};

export async function getPatientsRepository(): Promise<PatientsRepository> {
  const auth = await getAuthClient();
  const peopleClient = new people_v1.People({ auth });
  return new PatientsRepository(peopleClient);
}

export async function getInvoicesRepository(): Promise<InvoicesRepository> {
  const auth = await getAuthClient();
  const drive = new drive_v3.Drive({ auth });
  return new InvoicesRepository(drive);
}

export function getServicesRepository(): ServicesRepository {
  return new ServicesRepository();
}

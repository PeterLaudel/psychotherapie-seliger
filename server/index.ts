import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/config";
import { OAuth2Client } from "google-auth-library";
import { people_v1 } from "@googleapis/people";
import { sheets_v4 } from "@googleapis/sheets";
import { PatientRepository } from "../repositories/patients";
import { ServiceRepository } from "../repositories/services";
import { Patient } from "../models/patient";
import IRead from "../interfaces/read";
import { Service } from "../models/service";
import { Invoice } from "../models/invoice";
import { drive_v3 } from "@googleapis/drive";
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

export async function getPatientRepository(): Promise<IRead<Patient>> {
  const auth = await getAuthClient();
  const peopleClient = new people_v1.People({ auth });
  return new PatientRepository(peopleClient);
}

export async function getInvoicesRepository(): Promise<InvoicesRepository> {
  const auth = await getAuthClient();
  const drive = new drive_v3.Drive({ auth });
  return new InvoicesRepository(drive);
}

export async function getServicesRepository(): Promise<IRead<Service>> {
  return new ServiceRepository();
}

import { people_v1 } from "@googleapis/people/";
import { Patient } from "../models/patient";
import IRead from "../interfaces/read";

export class PatientRepository implements IRead<Patient> {
  private peopleClient: people_v1.People;

  constructor(peopleClient: people_v1.People) {
    this.peopleClient = peopleClient;
  }

  public async get(): Promise<Patient[]> {
    const { data } = await this.peopleClient.people.connections.list({
      resourceName: "people/me",
      personFields: "names,emailAddresses,phoneNumbers,addresses",
      pageSize: 1000,
    });

    if (!data.connections) return [];

    return data.connections?.map((person) => ({
      id: person?.resourceName as string,
      name: person?.names?.[0].givenName as string,
      surname: person?.names?.[0].familyName as string,
      email: person?.emailAddresses?.[0].value as string,
      patientAddress: {
        street: person?.addresses?.[0].streetAddress as string,
        zip: person?.addresses?.[0].postalCode as string,
        city: person?.addresses?.[0].city as string,
      },
    }));
  }
}

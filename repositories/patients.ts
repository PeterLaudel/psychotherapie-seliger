import { people_v1 } from "@googleapis/people/";
import { Patient } from "../models/patient";

export class PatientRepository {
  private peopleClient: people_v1.People;

  constructor(peopleClient: people_v1.People) {
    this.peopleClient = peopleClient;
  }

  public async get(): Promise<Patient[]> {
    const { data: contactGroup } = await this.peopleClient.contactGroups.get({
      resourceName: "contactGroups/1c812ccd8b6c2231",
      maxMembers: 1000,
    });

    contactGroup.memberResourceNames;
    console.log(contactGroup?.resourceName);

    const { data } = await this.peopleClient.people.getBatchGet({
      personFields: "names,emailAddresses,phoneNumbers,addresses",
      resourceNames: contactGroup.memberResourceNames || [],
    });
    if (!data.responses) return [];

    return data.responses
      .filter(({ person }) => person)
      .map(({ person }) => ({
        id: person?.resourceName as string,
        name: person?.names?.[0].givenName as string,
        surname: person?.names?.[0].familyName as string,
        email: person?.emailAddresses?.[0].value as string,
        phone: person?.phoneNumbers?.[0].value as string,
        address: person?.addresses?.[0].formattedValue as string,
        zip: person?.addresses?.[0].postalCode as string,
        city: person?.addresses?.[0].city as string,
      }));
  }
}

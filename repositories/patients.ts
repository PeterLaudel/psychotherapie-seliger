import { people_v1 } from "@googleapis/people/";
import { Patient } from "../models/patient";
import IRead from "../interfaces/read";
import Address from "../models/address";

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
      birthdate: this.convertToDate(person?.birthdays?.[0].date) as Date,
      address: this.convertToAddress(person?.addresses?.[0]) as Address,
    }));
  }

  private convertToDate(schemaDate?: people_v1.Schema$Date): Date | undefined {
    if (!schemaDate || !schemaDate.year || !schemaDate.month || !schemaDate.day)
      return undefined;

    return new Date(schemaDate.year, schemaDate.month - 1, schemaDate.day);
  }

  private convertToAddress(
    schemaAddress?: people_v1.Schema$Address
  ): Address | undefined {
    if (
      !schemaAddress ||
      !schemaAddress.streetAddress ||
      !schemaAddress.city ||
      !schemaAddress.postalCode
    )
      return undefined;

    return {
      street: schemaAddress.streetAddress as string,
      zip: schemaAddress.postalCode as string,
      city: schemaAddress.city as string,
    };
  }
}

import { people_v1 } from "@googleapis/people/";
import { Patient } from "../models/patient";
import IRead from "../interfaces/read";
import Address from "../models/address";

export type CreatePatient = Omit<Patient, "id">;
export class PatientsRepository implements IRead<Patient> {
  private peopleClient: people_v1.People;

  constructor(peopleClient: people_v1.People) {
    this.peopleClient = peopleClient;
  }

  public async create(patient: CreatePatient): Promise<Patient> {
    const { data } = await this.peopleClient.people.createContact({
      requestBody: {
        names: [
          {
            givenName: patient.name,
            familyName: patient.surname,
          },
        ],
        emailAddresses: [
          {
            value: patient.email,
          },
        ],
        birthdays: [
          {
            date: {
              year: patient.birthdate.getFullYear(),
              month: patient.birthdate.getMonth() + 1,
              day: patient.birthdate.getDate(),
            },
          },
        ],
        addresses: [
          {
            streetAddress: patient.address.street,
            postalCode: patient.address.zip,
            city: patient.address.city,
          },
        ],
      },
    });

    if (!data.resourceName) throw new Error("No resourceName found");

    const patientContactGroup = await this.patientsContactGroup();
    await this.peopleClient.contactGroups.members.modify({
      resourceName: patientContactGroup,
      requestBody: {
        resourceNamesToAdd: [data.resourceName],
      },
    });

    return {
      id: data.resourceName,
      name: patient.name,
      surname: patient.surname,
      email: patient.email,
      birthdate: patient.birthdate,
      address: patient.address,
      billingInfo: {
        name: patient.name,
        surname: patient.surname,
        email: patient.email,
        address: patient.address,
      },
    };
  }

  public async get(): Promise<Patient[]> {
    const patientContactGroup = await this.patientsContactGroup();
    const { data: contactGroup } = await this.peopleClient.contactGroups.get({
      resourceName: patientContactGroup,
      maxMembers: 1000,
    });

    if (!contactGroup.memberResourceNames) return [];

    const { data: people } = await this.peopleClient.people.getBatchGet({
      resourceNames: contactGroup.memberResourceNames,
      personFields: "names,emailAddresses,phoneNumbers,addresses,birthdays",
    });

    if (!people.responses) return [];

    return people.responses.map(({ person }) => ({
      id: person?.resourceName as string,
      name: person?.names?.[0].givenName as string,
      surname: person?.names?.[0].familyName as string,
      email: person?.emailAddresses?.[0].value as string,
      birthdate: this.convertToDate(person?.birthdays?.[0].date) as Date,
      address: this.convertToAddress(person?.addresses?.[0]) as Address,
      billingInfo: {
        name: person?.names?.[0].givenName as string,
        surname: person?.names?.[0].familyName as string,
        email: person?.emailAddresses?.[0].value as string,
        address: this.convertToAddress(person?.addresses?.[0]) as Address,
      },
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
      street: schemaAddress.streetAddress,
      zip: schemaAddress.postalCode,
      city: schemaAddress.city,
    };
  }

  private async patientsContactGroup() {
    return await findOrCreateByName(this.peopleClient, "Patienten");
  }
}

async function findOrCreateByName(people: people_v1.People, name: string) {
  const {
    data: { contactGroups },
  } = await people.contactGroups.list({});

  const contactGroup = contactGroups?.find((group) => group.name === name);
  if (contactGroup && contactGroup.resourceName)
    return contactGroup.resourceName;

  const {
    data: { resourceName },
  } = await people.contactGroups.create({
    requestBody: { contactGroup: { name } },
  });

  if (!resourceName) throw new Error("Could not create contactgroup");
  return resourceName;
}

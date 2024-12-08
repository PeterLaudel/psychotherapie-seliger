import { people_v1 } from "@googleapis/people/";
import { BillingInfo, Patient } from "../models/patient";
import IRead from "../interfaces/read";
import Address from "../models/address";

const PATIENT_GROUP = "Patienten";
const BILLING_GROUP = "Rechnungen";

export type CreatePatient = Omit<Patient, "id">;
export class PatientsRepository implements IRead<Patient> {
  private peopleClient: people_v1.People;

  constructor(peopleClient: people_v1.People) {
    this.peopleClient = peopleClient;
  }

  public async create(patient: CreatePatient): Promise<Patient> {
    const invoiceTo = patient.billingInfoIsPatient
      ? "Patient"
      : await this.createBillingContact(patient.billingInfo);

    const patientContact = await this.addContact({
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
      userDefined: [
        {
          key: "Rechnung",
          value: invoiceTo,
        },
      ],
    });

    await this.addContactToContactGroup(patientContact, PATIENT_GROUP);

    return {
      id: patientContact,
      name: patient.name,
      surname: patient.surname,
      email: patient.email,
      birthdate: patient.birthdate,
      address: patient.address,
      billingInfoIsPatient: false,
      billingInfo: {
        name: patient.billingInfo.name,
        surname: patient.billingInfo.surname,
        email: patient.billingInfo.email,
        address: patient.billingInfo.address,
      },
    };
  }

  public async get(): Promise<Patient[]> {
    const patientContactGroup = await findOrCreateByName(
      this.peopleClient,
      PATIENT_GROUP
    );
    const billingContactGroup = await findOrCreateByName(
      this.peopleClient,
      BILLING_GROUP
    );
    const {
      data: { responses },
    } = await this.peopleClient.contactGroups.batchGet({
      resourceNames: [patientContactGroup, billingContactGroup],
      maxMembers: 1000,
    });

    if (!responses) return [];

    const [patientResources, billingResources] = responses.map(
      (response) => response.contactGroup?.memberResourceNames || []
    );

    const { data: patients } = await this.peopleClient.people.getBatchGet({
      resourceNames: patientResources,
      personFields: "names,emailAddresses,birthdays,addresses,userDefined",
    });

    if (!patients?.responses) return [];

    const {
      data: billingContacts,
    } = await this.peopleClient.people.getBatchGet({
      resourceNames: billingResources,
      personFields: "names,emailAddresses,addresses",
    });

    const incompletePatients = patients.responses.map(({ person }) => ({
      id: person?.resourceName as string,
      name: person?.names?.[0].givenName as string,
      surname: person?.names?.[0].familyName as string,
      email: person?.emailAddresses?.[0].value as string,
      birthdate: this.convertToDate(person?.birthdays?.[0].date) as Date,
      address: this.convertToAddress(person?.addresses?.[0]) as Address,
      billing: person?.userDefined?.find((ud) => ud.key === "Rechnung")?.value,
    }));
    const billingPersons = (billingContacts.responses || []).map(
      ({ person }) => ({
        id: person?.resourceName as string,
        name: person?.names?.[0].givenName as string,
        surname: person?.names?.[0].familyName as string,
        email: person?.emailAddresses?.[0].value as string,
        address: this.convertToAddress(person?.addresses?.[0]) as Address,
      })
    );
    return incompletePatients.map((patient) => ({
      ...patient,
      billingInfoIsPatient: patient.billing === "Patient",
      billingInfo:
        patient.billing === "Patient"
          ? {
              ...patient,
            }
          : billingPersons.find((p) => p.id === patient.billing) || {
              ...patient,
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

  private async createBillingContact(billingInfo: BillingInfo) {
    const billingContact = await this.addContact({
      names: [
        {
          givenName: billingInfo.name,
          familyName: billingInfo.surname,
        },
      ],
      addresses: [
        {
          city: billingInfo.address.city,
          streetAddress: billingInfo.address.street,
          postalCode: billingInfo.address.zip,
        },
      ],
      emailAddresses: [
        {
          value: billingInfo.email,
        },
      ],
    });

    await this.addContactToContactGroup(billingContact, BILLING_GROUP);
    return billingContact;
  }

  private async addContact(person: people_v1.Schema$Person) {
    const { data } = await this.peopleClient.people.createContact({
      requestBody: { ...person },
    });
    if (!data.resourceName) throw Error("Contact could not be created");
    return data.resourceName;
  }

  private async addContactToContactGroup(
    contact: string,
    contactGroup: string
  ) {
    const groupId = await findOrCreateByName(this.peopleClient, contactGroup);
    await this.peopleClient.contactGroups.members.modify({
      resourceName: groupId,
      requestBody: {
        resourceNamesToAdd: [contact],
      },
    });
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

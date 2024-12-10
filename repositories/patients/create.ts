import { people_v1 } from "@googleapis/people";
import { Patient } from "../../models/patient";
import { BILLING_GROUP, findOrCreateByName, PATIENT_GROUP } from "./shared";

export type CreatePatient = Omit<Patient, "id">;

export default class Create {
  constructor(private readonly peopleClient: people_v1.People) {}

  public async create(patient: CreatePatient): Promise<Patient> {
    const invoiceTo = await this.createBillingContact(patient);

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
      userDefined: invoiceTo
        ? [
            {
              key: "Rechnung",
              value: invoiceTo,
            },
          ]
        : undefined,
    });

    const patientGroup = await findOrCreateByName(
      this.peopleClient,
      PATIENT_GROUP
    );
    await this.addContactToContactGroup(patientContact, patientGroup);

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

  private async createBillingContact({
    billingInfo,
    billingInfoIsPatient,
  }: CreatePatient): Promise<string | undefined> {
    if (billingInfoIsPatient) return undefined;

    const contact = await this.addContact({
      names: [
        {
          givenName: billingInfo.name,
          familyName: billingInfo.surname,
        },
      ],
      emailAddresses: [
        {
          value: billingInfo.email,
        },
      ],
      addresses: [
        {
          streetAddress: billingInfo.address.street,
          postalCode: billingInfo.address.zip,
          city: billingInfo.address.city,
        },
      ],
    });

    const billingGroup = await findOrCreateByName(
      this.peopleClient,
      BILLING_GROUP
    );
    await this.addContactToContactGroup(contact, billingGroup);
    return contact;
  }

  private async addContact(contact: people_v1.Schema$Person): Promise<string> {
    const { data } = await this.peopleClient.people.createContact({
      requestBody: contact,
    });

    return data.resourceName!;
  }

  private async addContactToContactGroup(contact: string, group: string) {
    await this.peopleClient.contactGroups.members.modify({
      resourceName: group,
      requestBody: {
        resourceNamesToAdd: [contact],
      },
    });
  }
}

import { people_v1 } from "@googleapis/people";
import { Patient } from "../../models/patient";
import Address from "../../models/address";
import {
  BILLING_GROUP,
  findOrCreateByName,
  PATIENT_GROUP,
  Repository,
} from "./shared";

export default function getPatients(this: Repository): Promise<Patient[]> {
  return new Get(this.peopleClient).get();
}

class Get {
  constructor(private readonly peopleClient: people_v1.People) {}

  public async get(): Promise<Patient[]> {
    const patientGroup = await findOrCreateByName(
      this.peopleClient,
      PATIENT_GROUP
    );
    const billingGroup = await findOrCreateByName(
      this.peopleClient,
      BILLING_GROUP
    );
    const {
      data: { responses },
    } = await this.peopleClient.contactGroups.batchGet({
      resourceNames: [patientGroup, billingGroup],
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
}

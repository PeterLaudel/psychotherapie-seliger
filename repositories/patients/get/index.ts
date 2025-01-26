import { people_v1 } from "@googleapis/people";
import { Patient } from "../../../models/patient";
import { convertToAddress, findOrCreateByName, PATIENT_GROUP } from "../shared";
import BillingInfos from "./billingInfos";

export default class Get {
  constructor(private readonly peopleClient: people_v1.People) {}

  public async get(): Promise<Patient[]> {
    const patientGroup = await this.patientContactGroup();
    const patientContactResourceNames = await this.patientContactResourceNames(
      patientGroup
    );
    const patientContacts = await this.patientContacts(
      patientContactResourceNames
    );
    const billingInfos = await this.billingInfos();

    return patientContacts.map(({ person: patientContact }) => {
      const billingId = patientContact?.userDefined?.find(
        (ud) => ud.key === "Rechnung"
      )?.value;

      const billingInfo = billingInfos.find((bi) => bi.id === billingId);
      const partialPatient = {
        id: patientContact?.resourceName as string,
        name: patientContact?.names?.[0].givenName as string,
        surname: patientContact?.names?.[0].familyName as string,
        email: patientContact?.emailAddresses?.[0].value as string,
        birthdate: this.convertToDate(patientContact?.birthdays?.[0].date),
        address: convertToAddress(patientContact?.addresses?.[0]),
        billingInfoIsPatient: !!billingInfo,
      };

      return {
        ...partialPatient,
        billingInfo: billingInfo || partialPatient,
      };
    });
  }

  private async patientContactGroup() {
    return await findOrCreateByName(this.peopleClient, PATIENT_GROUP);
  }

  private async patientContactResourceNames(patientContactGroup: string) {
    const {
      data: { memberResourceNames: patientContactResourceNames },
    } = await this.peopleClient.contactGroups.get({
      resourceName: patientContactGroup,
      maxMembers: 1000,
    });

    return patientContactResourceNames || [];
  }

  private async patientContacts(patientContactResourceNames: string[]) {
    if (patientContactResourceNames.length === 0) return [];

    const { data: patients } = await this.peopleClient.people.getBatchGet({
      resourceNames: patientContactResourceNames,
      personFields: "names,emailAddresses,birthdays,addresses,userDefined",
    });

    return patients.responses || [];
  }

  private async billingInfos() {
    const getBillingInfos = new BillingInfos(this.peopleClient);
    return await getBillingInfos.get();
  }

  private convertToDate(schemaDate?: people_v1.Schema$Date): Date {
    if (!schemaDate || !schemaDate.year || !schemaDate.month || !schemaDate.day)
      throw new Error("Invalid date");

    return new Date(schemaDate.year, schemaDate.month - 1, schemaDate.day);
  }
}

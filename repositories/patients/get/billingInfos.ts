import { people_v1 } from "@googleapis/people";
import { BillingInfo } from "../../../models/patient";
import { BILLING_GROUP, convertToAddress, findOrCreateByName } from "../shared";

type BillingInfoWithId = BillingInfo & { id: string };

export default class BillingInfos {
  constructor(private readonly peopleClient: people_v1.People) {}

  public async get(): Promise<BillingInfoWithId[]> {
    const billingInfoContactGroup = await this.billingInfoContactGroup();
    const billingInfoResourceNames = await this.billingInfoResourceNames(
      billingInfoContactGroup
    );
    const billingInfoContacts = await this.billingInfoContacts(
      billingInfoResourceNames
    );

    return billingInfoContacts.map(({ person: billingInfoContact }) => ({
      id: billingInfoContact?.resourceName as string,
      name: billingInfoContact?.names?.[0].givenName as string,
      surname: billingInfoContact?.names?.[0].familyName as string,
      email: billingInfoContact?.emailAddresses?.[0].value as string,
      address: convertToAddress(billingInfoContact?.addresses?.[0]),
    }));
  }

  private async billingInfoContactGroup() {
    return await findOrCreateByName(this.peopleClient, BILLING_GROUP);
  }

  private async billingInfoResourceNames(billingInfoContactGroup: string) {
    const {
      data: { memberResourceNames: billingInfoContactResourceNames },
    } = await this.peopleClient.contactGroups.get({
      resourceName: billingInfoContactGroup,
      maxMembers: 1000,
    });

    return billingInfoContactResourceNames || [];
  }

  private async billingInfoContacts(billingInfoResourceNames: string[]) {
    if (billingInfoResourceNames.length === 0) return [];

    const {
      data: billingContacts,
    } = await this.peopleClient.people.getBatchGet({
      resourceNames: billingInfoResourceNames,
      personFields: "names,emailAddresses,addresses",
    });

    if (!billingContacts.responses) return [];

    return billingContacts.responses;
  }
}

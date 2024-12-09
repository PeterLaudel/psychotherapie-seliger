import { people_v1 } from "@googleapis/people";

export const BILLING_GROUP = "Rechnungen";
export const PATIENT_GROUP = "Patienten";

export class Repository {
  constructor(protected readonly peopleClient: people_v1.People) {}
}

export async function findOrCreateByName(
  people: people_v1.People,
  name: string
) {
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

import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import { Patient } from "../src/models/patient";
import { db } from "../src/initialize";

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export const patientFactory = Factory.define<PartialBy<Patient, "id">>(() => ({
  name: faker.person.firstName(),
  surname: faker.person.lastName(),
  email: faker.internet.email(),
  birthdate: "2020-01-01",
  address: {
    street: faker.location.street(),
    city: faker.location.city(),
    zip: faker.location.zipCode(),
  },
  billingInfo: {
    name: faker.person.firstName(),
    surname: faker.person.lastName(),
    email: faker.internet.email(),
    address: {
      street: faker.location.street(),
      city: faker.location.city(),
      zip: faker.location.zipCode(),
    },
  },
})).onCreate(async (patient) => {
  const { address, billingInfo, ...rest } = patient;
  const mappedBillingInfo = {
    billingName: billingInfo.name,
    billingSurname: billingInfo.surname,
    billingEmail: billingInfo.email,
    billingStreet: billingInfo.address.street,
    billingCity: billingInfo.address.city,
    billingZip: billingInfo.address.zip,
  };
  const { id: dbId } = await db
    .insertInto("patients")
    .values({ ...rest, ...address, ...mappedBillingInfo })
    .returning(["id"])
    .executeTakeFirstOrThrow();
  return { id: dbId, ...patient };
});

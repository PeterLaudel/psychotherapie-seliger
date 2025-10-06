import { Factory } from "fishery";
import { db } from "../src/initialize";
import type { Therapeut } from "@/models/therapeut";
import { faker } from "@faker-js/faker";

export const therapeutFactory = Factory.define<
  Omit<Therapeut, "id">,
  unknown,
  Therapeut
>(() => ({
  title: faker.person.prefix(),
  name: faker.person.firstName(),
  surname: faker.person.lastName(),
  street: faker.location.streetAddress(),
  zip: faker.location.zipCode(),
  city: faker.location.city(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  taxId: faker.string.alphanumeric(10).toUpperCase(),
  bankName: faker.company.name(),
  iban: faker.finance.iban(),
  bic: faker.finance.bic(),
  website: faker.internet.url(),
})).onCreate(async (therapeut) => {
  const createdTherapeut = await db
    .insertInto("therapeuts")
    .values(therapeut)
    .returningAll()
    .executeTakeFirstOrThrow();

  return createdTherapeut;
});

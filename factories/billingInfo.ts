import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import { addressFactory } from "./address";
import { BillingInfo } from "@/models/patient";

const billingInfoFactory: Factory<BillingInfo> = Factory.define<BillingInfo>(
  () => ({
    name: faker.person.firstName(),
    surname: faker.person.lastName(),
    email: faker.internet.email(),
    address: addressFactory.build(),
  })
);

export { billingInfoFactory };

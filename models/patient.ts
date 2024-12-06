import Address from "./address";

export interface Patient {
  id: string;
  name: string;
  surname: string;
  email: string;
  birthdate: Date;
  address: Address;
  billingInfo: {
    name: string;
    surname: string;
    email: string;
    address: Address;
  };
}

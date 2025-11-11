import Address from "./address";

export interface BillingInfo {
  name: string;
  surname: string;
  email: string;
  address: Address;
}

export interface Patient {
  id: number;
  name: string;
  surname: string;
  email: string;
  birthdate: string;
  address: Address;
  diagnosis: string | null;
  billingInfo: BillingInfo;
}

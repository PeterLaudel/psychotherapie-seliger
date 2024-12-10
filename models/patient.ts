import Address from "./address";

interface BillingInfo {
  name: string;
  surname: string;
  email: string;
  address: Address;
}

export interface Patient {
  id: string;
  name: string;
  surname: string;
  email: string;
  birthdate: Date;
  address: Address;
  billingInfoIsPatient: boolean;
  billingInfo: BillingInfo;
}

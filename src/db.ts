import { Generated } from "kysely";

export interface Database {
  patients: PatientTable;
}

interface PatientTable {
  id: Generated<number>;
  name: string;
  surname: string;
  email: string;
  birthdate: string;
  street: string;
  city: string;
  zip: string;
  billingName: string;
  billingSurname: string;
  billingEmail: string;
  billingStreet: string;
  billingCity: string;
  billingZip: string;
}

import { Generated } from "kysely";

export interface Database {
  patients: PatientTable;
  invoices: InvoicesTable;
  invoicePositions: InvoicePositionsTable;
  services: ServicesTable;
  serviceAmounts: ServiceAmountsTable;
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

interface InvoicesTable {
  id: Generated<number>;
  invoiceNumber: string;
  patientId: number;
}

interface InvoicePositionsTable {
  id: Generated<number>;
  invoiceId: number;
  serviceDate: string;
  serviceId: number;
  factor: "1.0" | "1.8" | "2.3";
  amount: number;
  pageBreak?: number; // 0 for false, 1 for true
}

interface ServicesTable {
  id: Generated<number>;
  short: string;
  originalGopNr: string;
  description: string;
  points: number;
  note?: string;
}

interface ServiceAmountsTable {
  id: Generated<number>;
  serviceId: number;
  factor: "1.0" | "1.8" | "2.3";
  price: number;
}

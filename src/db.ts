import { Generated } from "kysely";

export interface Database {
  patients: PatientTable;
  invoices: InvoicesTable;
  invoicePositions: InvoicePositionsTable;
  patientInvoices: PatientInvoiceTable;
  services: ServicesTable;
  serviceAmounts: ServiceAmountsTable;
  therapeuts: TherapeutsTable;
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
  diagnosis: string | null;
  billingName: string;
  billingSurname: string;
  billingEmail: string;
  billingStreet: string;
  billingCity: string;
  billingZip: string;
}

export interface InvoicesTable {
  id: Generated<number>;
  invoiceNumber: string;
  base64Pdf: string;
  invoiceAmount: number;
  status: "pending" | "sent" | "paid";
  createdAt: Generated<string>;
}

export interface InvoicePositionsTable {
  id: Generated<number>;
  invoiceId: number;
  serviceId: number;
  serviceDate: string;
  pageBreak: number;
  amount: number;
  factor: "1.0" | "1.8" | "2.3";
}

export interface PatientInvoiceTable {
  id: Generated<number>;
  patientId: number;
  invoiceId: number;
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

interface TherapeutsTable {
  id: Generated<number>;
  title: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
  taxId: string;
  iban: string;
  bic: string;
  bankName: string;
  website: string;
  enr: string;
}

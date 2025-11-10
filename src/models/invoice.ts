import { Factor, Service } from "./service";

export interface InvoicePosition {
  serviceDate: string;
  service: Service;
  pageBreak: boolean;
  amount: number;
  factor: Factor;
}

export interface Invoice {
  id: number;
  base64Pdf: string;
  invoiceNumber: string;
  invoiceAmount: number;
  name: string;
  surname: string;
  email: string;
  status: "pending" | "sent" | "paid";
  positions: InvoicePosition[];
}

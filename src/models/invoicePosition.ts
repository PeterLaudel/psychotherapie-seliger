import { Factor } from "./service";

export interface InvoicePosition {
  id: number;
  invoiceId: number;
  serviceDate: string;
  serviceId: number;
  factor: Factor;
  amount: number;
  pageBreak?: boolean;
}

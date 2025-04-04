export interface InvoicePosition {
  id: number;
  invoiceId: number;
  serviceDate: string;
  serviceId: number;
  factor: string;
  amount: number;
}

export interface Invoice {
  id: number;
  patientId: number;
}

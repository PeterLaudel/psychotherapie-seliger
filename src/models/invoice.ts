export interface Invoice {
  id: number;
  patientId: number;
  base64Pdf: string;
  invoiceNumber: string;
}

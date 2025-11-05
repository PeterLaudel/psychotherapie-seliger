export interface Invoice {
  id: number;
  base64Pdf: string;
  invoiceNumber: string;
  invoiceAmount: number;
  name: string;
  surname: string;
  email: string;
}

"use client";

import { Invoice } from "@/models/invoice";

interface Props {
  invoice: Invoice;
}

export function InvoiceViewer({ invoice }: Props) {
  return (
    <iframe
      className="w-full h-full"
      name="pdf-viewer"
      src={`/api/invoices/${invoice.invoiceNumber}`}
    />
  );
}

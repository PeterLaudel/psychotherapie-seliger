import { Invoice } from "@/models/invoice";

interface Props {
  invoice: Invoice;
}

export function InvoiceStatus({ invoice }: Props) {
  return <>{invoice.status}</>;
}

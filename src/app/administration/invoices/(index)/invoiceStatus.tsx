import { Invoice } from "@/models/invoice";
import { Check, Email, HourglassEmpty } from "@mui/icons-material";

interface Props {
  invoice: Invoice;
}

export function InvoiceStatus({ invoice }: Props) {
  return (
    <>
      {invoice.status === "pending" && (
        <HourglassEmpty className="text-amber-400" />
      )}
      {invoice.status === "sent" && <Email className="text-blue-500" />}
      {invoice.status === "paid" && <Check className="text-green-500" />}
    </>
  );
}

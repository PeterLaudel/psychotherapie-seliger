import { Invoice } from "@/models/invoice";
import { IconButton } from "@mui/material";
import { Delete, Download, Send } from "@mui/icons-material";
import { sendInvoiceEmail } from "./action";

interface Props {
  invoice: Invoice;
}

export function InvoiceAction({ invoice }: Props) {
  return (
    <>
      {invoice.status === "pending" && (
        <IconButton onClick={async () => sendInvoiceEmail(invoice.id)}>
          <Send />
        </IconButton>
      )}
      <IconButton
        href={`/api/invoices/${invoice.invoiceNumber}`}
        target="_blank"
        download={true}
      >
        <Download />
      </IconButton>
      <IconButton>
        <Delete />
      </IconButton>
    </>
  );
}

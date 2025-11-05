import { Invoice } from "@/models/invoice";
import { IconButton } from "@mui/material";
import { Delete, Send, Visibility } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { sendInvoiceEmail } from "./action";

interface Props {
  invoice: Invoice;
}

export function InvoiceAction({ invoice }: Props) {
  const router = useRouter();

  return (
    <div>
      <IconButton
        onClick={() => router.push(`/administration/invoices/${invoice.id}`)}
      >
        <Visibility />
      </IconButton>
      <IconButton onClick={() => sendInvoiceEmail(invoice.id)}>
        <Send />
      </IconButton>
      <IconButton>
        <Delete />
      </IconButton>
    </div>
  );
}

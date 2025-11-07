import { Invoice } from "@/models/invoice";
import { Button, CircularProgress, Dialog, IconButton } from "@mui/material";
import { Delete, Download, Paid, Send } from "@mui/icons-material";
import { deleteInvoice, markInvoiceAsPaid, sendInvoiceEmail } from "./action";
import { useState, useTransition } from "react";

interface Props {
  invoice: Invoice;
}

export function InvoiceAction({ invoice }: Props) {
  return (
    <>
      {invoice.status === "pending" && <SendButton invoice={invoice} />}
      {invoice.status === "sent" && <PaidButton invoice={invoice} />}
      <DownloadButton invoice={invoice} />
      <DeleteButton invoice={invoice} />
    </>
  );
}

function PaidButton({ invoice }: { invoice: Invoice }) {
  const [isPending, startTransition] = useTransition();
  return (
    <IconButton
      onClick={() =>
        startTransition(async () => await markInvoiceAsPaid(invoice.id))
      }
      disabled={isPending}
    >
      {!isPending && <Paid />}
      {isPending && <CircularProgress size={"1em"} color="inherit" />}
    </IconButton>
  );
}

function SendButton({ invoice }: { invoice: Invoice }) {
  const [isPending, startTransition] = useTransition();

  return (
    <IconButton
      onClick={() =>
        startTransition(async () => await sendInvoiceEmail(invoice.id))
      }
      disabled={isPending}
    >
      {!isPending && <Send />}
      {isPending && <CircularProgress size={"1em"} color="inherit" />}
    </IconButton>
  );
}

function DownloadButton({ invoice }: { invoice: Invoice }) {
  return (
    <IconButton
      href={`/api/invoices/${invoice.invoiceNumber}`}
      target="_blank"
      download={true}
    >
      <Download />
    </IconButton>
  );
}

function DeleteButton({ invoice }: { invoice: Invoice }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton onClick={() => setOpen(true)} disabled={isPending}>
        {!isPending && <Delete />}
        {isPending && <CircularProgress size={"1em"} color="inherit" />}
      </IconButton>
      <Dialog open={open}>
        <div className="p-4 flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Rechnung löschen?</h2>
          <p>Sind Sie sicher, dass Sie diese Rechnung löschen möchten?</p>
          <div className="flex justify-end gap-4">
            <Button onClick={() => setOpen(false)} disabled={isPending}>
              Abbrechen
            </Button>
            <Button
              onClick={() =>
                startTransition(async () => {
                  await deleteInvoice(invoice.id);
                  setOpen(false);
                })
              }
              disabled={isPending}
            >
              {!isPending && "Löschen"}
              {isPending && <CircularProgress size={"1em"} color="inherit" />}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

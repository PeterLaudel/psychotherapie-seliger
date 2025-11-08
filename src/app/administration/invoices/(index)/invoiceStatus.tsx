import { Invoice } from "@/models/invoice";
import { CheckCircle, Email, HourglassEmpty } from "@mui/icons-material";
import { Button, Menu, MenuItem } from "@mui/material";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import { useRef, useState } from "react";
import {
  markInvoiceAsPaid,
  markInvoiceAsPending,
  markInvoiceAsSent,
} from "./action";

interface Props {
  invoice: Invoice;
}

export function InvoiceStatus({ invoice }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  return (
    <>
      <Button
        ref={ref}
        onClick={() => setOpen((isOpen) => !isOpen)}
        className="flex items-center gap-1"
      >
        {invoice.status === "pending" && (
          <>
            <HourglassEmpty className="text-amber-400" />
            Erstellt
            <ArrowDropDownIcon />
          </>
        )}
        {invoice.status === "sent" && (
          <>
            <Email className="text-blue-500" />
            Versendet
            <ArrowDropDownIcon />
          </>
        )}
        {invoice.status === "paid" && (
          <>
            <CheckCircle className="text-green-500" />
            Bezahlt
            <ArrowDropDownIcon />
          </>
        )}
      </Button>
      <Menu
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={ref.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem
          value="pending"
          className="gap-2 flex items-center"
          onClick={async () => {
            await markInvoiceAsPending(invoice.id);
            setOpen(false);
          }}
        >
          <HourglassEmpty className="text-amber-400" />
          Erstellt
        </MenuItem>
        <MenuItem
          value="sent"
          className="gap-2 flex items-center"
          onClick={async () => {
            await markInvoiceAsSent(invoice.id);
            setOpen(false);
          }}
        >
          <Email className="text-blue-500" />
          Versendet
        </MenuItem>
        <MenuItem
          value="paid"
          className="gap-2 flex items-center"
          onClick={async () => {
            await markInvoiceAsPaid(invoice.id);
            setOpen(false);
          }}
        >
          <CheckCircle className="text-green-500" />
          Als Bezahlt markieren
        </MenuItem>
      </Menu>
    </>
  );
}

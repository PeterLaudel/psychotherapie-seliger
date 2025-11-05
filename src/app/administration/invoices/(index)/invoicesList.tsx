"use client";

import { useRouter } from "next/navigation";
import { Button, NoSsr } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Invoice } from "@/models/invoice";
import Section from "@/components/section";
import { InvoiceAction } from "./invoiceAction";
import { I } from "node_modules/@faker-js/faker/dist/airline-CLphikKp";

interface Props {
  invoices: Invoice[];
}

const GermanyCurrencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

const columns: GridColDef<Invoice>[] = [
  { field: "invoiceNumber", headerName: "Rechnungsnummer", flex: 1 },
  { field: "name", headerName: "Vorname", flex: 1 },
  { field: "surname", headerName: "Nachname", flex: 1 },
  {
    field: "invoiceAmount",
    headerName: "Betrag",
    width: 110,
    valueFormatter: (params) => GermanyCurrencyFormatter.format(params),
  },
  {
    field: "action",
    headerName: "Aktion",
    renderCell: (params) => <InvoiceAction invoice={params.row} />,
    flex: 1,
  },
];

export function InvoicesList({ invoices }: Props) {
  const router = useRouter();

  return (
    <div className="m-4 grid gap-4 grid-flow-row h-fit">
      <h1>Invoices</h1>
      <Section>
        <div className="grid grid-flow-row gap-4">
          <div className="w-full flex justify-end">
            <Button
              onClick={() => router.push("/administration/invoices/create")}
            >
              Rechnung anlegen
            </Button>
          </div>
          <NoSsr>
            <DataGrid<Invoice>
              rows={invoices}
              columns={columns}
              disableColumnMenu
              hideFooter
            />
          </NoSsr>
        </div>
      </Section>
    </div>
  );
}

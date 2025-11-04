"use client";

import { useRouter } from "next/navigation";
import { Button, NoSsr } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Invoice } from "@/models/invoice";
import Section from "@/components/section";

interface Props {
  invoices: Invoice[];
}

const GermanyCurrencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

const columns: GridColDef<Invoice>[] = [
  { field: "invoiceNumber", headerName: "Rechnungsnummer", width: 90 },
  { field: "name", headerName: "Vorname", width: 150 },
  { field: "surname", headerName: "Nachname", width: 150 },
  {
    field: "invoiceAmount",
    headerName: "Betrag",
    width: 110,
    valueFormatter: (params) => GermanyCurrencyFormatter.format(params),
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
            <DataGrid
              rows={invoices}
              columns={columns}
              disableColumnMenu
              hideFooter
              onRowClick={(params) =>
                router.push(`/administration/invoices/${params.row.id}`)
              }
            />
          </NoSsr>
        </div>
      </Section>
    </div>
  );
}

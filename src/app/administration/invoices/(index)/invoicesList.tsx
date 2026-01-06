"use client";

import { useRouter } from "next/navigation";
import { Button, NoSsr } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Invoice } from "@/models/invoice";
import Section from "@/components/section";
import { InvoiceAction } from "./invoiceAction";
import { InvoiceStatus } from "./invoiceStatus";

interface Props {
  invoices: Invoice[];
}

const GermanyCurrencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

const columns: GridColDef<Invoice>[] = [
  { field: "invoiceNumber", headerName: "Rechnungsnummer", flex: 1 },
  {
    field: "name",
    headerName: "Vorname",
    flex: 1,
    renderCell: (params) => params.row.patient.name,
  },
  {
    field: "surname",
    headerName: "Nachname",
    flex: 1,
    renderCell: (params) => params.row.patient.surname,
  },
  {
    field: "invoiceAmount",
    headerName: "Betrag",
    width: 110,
    valueFormatter: (params) => GermanyCurrencyFormatter.format(params),
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    align: "center",
    renderCell: (params) => <InvoiceStatus invoice={params.row} />,
  },
  {
    field: "action",
    headerName: "",
    renderCell: (params) => <InvoiceAction invoice={params.row} />,
    flex: 1,
    align: "right",
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
            <div className="h-full w-full">
              <DataGrid<Invoice>
                rows={invoices}
                columns={columns}
                disableColumnMenu
                hideFooter
                onRowClick={(params, event) => {
                  const tartget = event.target as HTMLElement;
                  if (tartget.closest("button") || tartget.closest("a")) {
                    return;
                  }
                  router.push(`/administration/invoices/${params.row.id}`);
                }}
              />
            </div>
          </NoSsr>
        </div>
      </Section>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Invoice } from "@/models/invoice";
import Section from "@/components/section";

interface Props {
  invoices: Invoice[];
}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "name", headerName: "Vorname", width: 150 },
  { field: "surname", headerName: "Nachname", width: 150 },
  { field: "patientId", headerName: "Patient ID", width: 150 },
  { field: "invoiceNumber", headerName: "Invoice Number", width: 150 },
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
          <DataGrid
            rows={invoices}
            columns={columns}
            disableColumnMenu
            hideFooter
          />
        </div>
      </Section>
    </div>
  );
}

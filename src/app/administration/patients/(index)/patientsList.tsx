"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Section from "@/components/section";
import { Patient } from "@/models/patient";
import { useEffect, useState } from "react";

interface Props {
  patients: Patient[];
}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "name", headerName: "Name", width: 150 },
  { field: "surname", headerName: "Surname", width: 150 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "birthdate", headerName: "Birthdate", width: 150 },
];

export default function PatientsList({ patients }: Props) {
  const [didMount, setDidMount] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => setDidMount(true));
  }, []);

  return (
    <div className="m-4 grid gap-4 grid-flow-row h-fit">
      <h1>Patienten</h1>

      <Section>
        <div className="grid grid-flow-row gap-4">
          <div className="w-full flex justify-end">
            <Button
              onClick={() => router.push("/administration/patients/create")}
            >
              Patienten anlegen
            </Button>
          </div>
          {didMount && (
            <DataGrid
              rows={patients}
              columns={columns}
              disableColumnMenu
              hideFooter
              onRowClick={(params) => {
                router.push(`/administration/patients/${params.row.id}`);
              }}
              getRowId={(row) => row.id}
            />
          )}
        </div>
      </Section>
    </div>
  );
}

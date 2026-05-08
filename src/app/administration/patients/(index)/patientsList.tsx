"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, NoSsr } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Section from "@/components/section";
import { Patient } from "@/models/patient";
import { Filter } from "./filter";
import { patientsQueryKey, fetchPatients } from "@/queries/patients";

const columns: GridColDef<Patient>[] = [
  { field: "name", headerName: "Name", width: 150 },
  { field: "surname", headerName: "Surname", width: 150 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "birthdate", headerName: "Birthdate", width: 150 },
];

export default function PatientsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const { data: patients = [] } = useQuery({
    queryKey: patientsQueryKey(search),
    queryFn: () => fetchPatients(search),
    
  });

  return (
    <div className="m-4 grid gap-4 grid-flow-row h-fit">
      <h1>Patienten</h1>

      <Section>
        <div className="grid grid-flow-row gap-4">
          <div className="w-full flex justify-end gap-4">
            <Filter />
            <Button
              onClick={() => router.push("/administration/patients/create")}
            >
              Patienten anlegen
            </Button>
          </div>
          <NoSsr>
            <div className="h-full w-full">
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
            </div>
          </NoSsr>
        </div>
      </Section>
    </div>
  );
}

"use client";

import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Button, NoSsr } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Section from "@/components/section";
import { Patient } from "@/models/patient";
import { Filter } from "./filter";
import { patientsQueryKey, fetchPatients } from "@/queries/patients";
import { useState, useEffect } from "react";

const columns: GridColDef<Patient>[] = [
  { field: "name", headerName: "Name", width: 150 },
  { field: "surname", headerName: "Surname", width: 150 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "birthdate", headerName: "Birthdate", width: 150 },
];

const DEFAULT_PAGE_SIZE = 10;

export default function PatientsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const page = Number(searchParams.get("page")) || 0;
  const pageSize = Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE;

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page,
    pageSize,
  });

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [search]);

  const query = { search, ...paginationModel };

  const { data } = useQuery({
    queryKey: patientsQueryKey(query),
    queryFn: () => fetchPatients(query),
    placeholderData: keepPreviousData,
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
                rows={data?.rows ?? []}
                rowCount={data?.total ?? 0}
                columns={columns}
                disableColumnMenu
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
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

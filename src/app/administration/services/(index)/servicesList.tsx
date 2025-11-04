"use client";

import Section from "@/components/section";
import { Service, factorArray } from "@/models/service";
import { NoSsr } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "short", headerName: "Kürzel", width: 200 },
  { field: "originalGopNr", headerName: "GopNr", width: 150 },
  { field: "description", headerName: "Beschreibung", width: 400 },
  { field: "points", headerName: "Punkte", width: 110 },
  ...factorArray.map<GridColDef>((factor) => ({
    field: `${factor}`,
    headerName: `${factor}-fach in €`,
    width: 110,
  })),
];

interface Props {
  services: Service[];
}

export default function ServiceList({ services }: Props) {
  const router = useRouter();

  const servicesMapped = services.map((service) => ({
    ...service,
    ...service.amounts.reduce((acc, amount) => {
      return { [amount.factor]: amount.price, ...acc };
    }, {} as Record<string, number | null>),
  }));

  return (
    <div className="m-4 grid gap-4 grid-flow-row h-fit">
      <h1>Leistungen</h1>
      <Section>
        <NoSsr>
          <DataGrid
            getRowHeight={() => "auto"}
            rows={servicesMapped}
            columns={columns}
            disableColumnMenu
            hideFooter
            onRowClick={(params) =>
              router.push(`/administration/services/${params.row.id}`)
            }
          />
        </NoSsr>
      </Section>
    </div>
  );
}

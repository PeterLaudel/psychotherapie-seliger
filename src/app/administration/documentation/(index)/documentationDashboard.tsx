"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Chip, NoSsr } from "@mui/material";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Section from "@/components/section";
import { Session } from "@/models/session";
import { sessionsQueryKey, fetchSessions } from "@/queries/sessions";

const riskColors: Record<string, "default" | "warning" | "error"> = {
  none: "default",
  low: "warning",
  moderate: "warning",
  high: "error",
};

const riskLabels: Record<string, string> = {
  none: "Kein",
  low: "Niedrig",
  moderate: "Mittel",
  high: "Hoch",
};

const columns: GridColDef<Session>[] = [
  {
    field: "sessionDate",
    headerName: "Datum",
    flex: 1,
    renderCell: (params) =>
      new Intl.DateTimeFormat("de-DE").format(new Date(params.value)),
  },
  {
    field: "patient",
    headerName: "Patient",
    flex: 1.5,
    renderCell: (params) => `${params.value.name} ${params.value.surname}`,
  },
  { field: "sessionNumber", headerName: "Nr.", width: 60 },
  { field: "sessionType", headerName: "Typ", flex: 1 },
  { field: "phase", headerName: "Phase", flex: 1, valueFormatter: (value) => value ?? "—" },
  {
    field: "riskLevel",
    headerName: "Risiko",
    flex: 1,
    renderCell: (params) =>
      params.value ? (
        <Chip
          label={riskLabels[params.value] ?? params.value}
          color={riskColors[params.value] ?? "default"}
          size="small"
        />
      ) : (
        "—"
      ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    renderCell: (params) =>
      params.value === "draft" ? (
        <Chip label="Entwurf" size="small" variant="outlined" />
      ) : null,
  },
];

interface Props {
  initialSessions: Session[];
}

export default function DocumentationDashboard({ initialSessions }: Props) {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: sessionsQueryKey(),
    queryFn: () => fetchSessions(),
    initialData: { rows: initialSessions, total: initialSessions.length },
  });

  const highRiskSessions = (data?.rows ?? []).filter((s) => s.riskLevel === "high");

  return (
    <div className="m-4 grid gap-4 grid-flow-row h-fit">
      <h1>Dokumentation</h1>

      {highRiskSessions.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded p-4">
          <h2 className="text-red-700 mb-2">Aktive Risiko-Flags</h2>
          <ul className="space-y-1">
            {highRiskSessions.map((s) => (
              <li key={s.id} className="flex items-center gap-2">
                <Chip label="Hoch" color="error" size="small" />
                <span
                  className="cursor-pointer underline text-red-800"
                  onClick={() => router.push(`/administration/documentation/${s.id}`)}
                >
                  {s.patient.name} {s.patient.surname} —{" "}
                  {new Intl.DateTimeFormat("de-DE").format(new Date(s.sessionDate))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Section>
        <div className="grid grid-flow-row gap-4">
          <div className="flex justify-end">
            <Button onClick={() => router.push("/administration/documentation/create")}>
              Sitzung dokumentieren
            </Button>
          </div>
          <NoSsr>
            <div className="h-full w-full">
              <DataGrid
                rows={data?.rows ?? []}
                columns={columns}
                disableColumnMenu
                autoHeight
                onRowClick={(params) =>
                  router.push(`/administration/documentation/${params.row.id}`)
                }
                getRowId={(row) => row.id}
              />
            </div>
          </NoSsr>
        </div>
      </Section>
    </div>
  );
}

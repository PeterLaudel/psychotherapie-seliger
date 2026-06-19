"use client";

import { Tab, Tabs } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  patientId: string;
}

export default function PatientTabs({ patientId }: Props) {
  const pathname = usePathname();

  const base = `/administration/patients/${patientId}`;

  const currentTab = pathname.endsWith("/sessions")
    ? "sessions"
    : "stammdaten";

  return (
    <Tabs value={currentTab} textColor="primary" indicatorColor="primary">
      <Tab
        label="Stammdaten"
        value="stammdaten"
        component={Link}
        href={base}
      />
      <Tab
        label="Sitzungen"
        value="sessions"
        component={Link}
        href={`${base}/sessions`}
      />
    </Tabs>
  );
}

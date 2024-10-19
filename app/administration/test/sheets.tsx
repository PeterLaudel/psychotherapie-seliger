"use client";

import { Patient } from "../../../models/patient";
import Select from "react-select";

interface Props {
  patients: Patient[];
}

export default function Sheets({ patients }: Props) {
  const options = patients.map((patient) => ({
    label: `${patient.name} ${patient.surname}`,
    value: patient.id,
  }));

  return <Select options={options} />;
}

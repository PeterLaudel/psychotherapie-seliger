"use client";

import { Patient as PatientType } from "../../../models/patient";
import { Field } from "react-final-form";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";

interface Props {
  patients: PatientType[];
}

export default function Patient({ patients }: Props) {
  return (
    <Field<PatientType>
      name="patient"
      type="select"
      validate={(value) =>
        value ? undefined : "Bitte wählen Sie einen Patienten aus"
      }
    >
      {({ input, meta: { error, touched } }) => (
        <Autocomplete
          options={patients}
          onChange={(_, value) => input.onChange(value)}
          getOptionLabel={(patient) => `${patient.name} ${patient.surname}`}
          getOptionKey={(patient) => patient.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Patient"
              onBlur={input.onBlur}
              error={error && touched}
              helperText={touched && error ? error : undefined}
            />
          )}
        />
      )}
    </Field>
  );
}

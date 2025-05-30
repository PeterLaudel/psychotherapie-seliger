"use client";

import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { Field } from "react-final-form";
import { Patient as PatientType } from "@/models/patient";
import Section from "@/components/section";

interface Props {
  patients: PatientType[];
}

const validatePatient = (value?: number) =>
  value ? undefined : "Bitte wählen Sie einen Patienten aus";

export default function PatientSection({ patients }: Props) {
  return (
    <Section>
      <h2 className="mb-4">Patient</h2>
      <div className="grid grid-flow-col gap-x-4">
        <Field<number | undefined>
          name="patientId"
          type="select"
          validate={validatePatient}
        >
          {({ input, meta: { error, touched } }) => (
            <Autocomplete
              options={patients}
              onChange={(_, value) => input.onChange(value?.id)}
              getOptionLabel={(patient) => `${patient.name} ${patient.surname}`}
              getOptionKey={(patient) => patient.id}
              value={patients.find(({ id }) => id === input.value) || null}
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
        <Field<string> name="diagnosis" type="text">
          {({ input }) => <TextField {...input} label="Diagnose" />}
        </Field>
      </div>
    </Section>
  );
}

"use client";

import Section from "@/components/section";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Controller, useFormContext } from "react-hook-form";
import { PatientFormData } from "./schema";

export default function PatientSection() {
  const { control } = useFormContext<PatientFormData>();

  return (
    <Section>
      <h2 className="mb-4">Patientendaten</h2>
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="Vorname" error={!!error} helperText={error?.message} />
          )}
        />
        <Controller
          name="surname"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="Nachname" error={!!error} helperText={error?.message} />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="E-Mail" error={!!error} helperText={error?.message} />
          )}
        />
        <Controller
          name="birthdate"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DatePicker
              label="Geburtsdatum"
              value={field.value ? dayjs(field.value) : null}
              onChange={(newValue) => field.onChange(newValue ? newValue.format("YYYY-MM-DD") : "")}
              slotProps={{
                textField: {
                  error: !!error,
                  helperText: error?.message,
                  onBlur: field.onBlur,
                },
              }}
            />
          )}
        />
        <Controller
          name="diagnosis"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              value={field.value ?? ""}
              label="Diagnose"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Controller
          name="address.street"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="Straße" className="col-span-2" error={!!error} helperText={error?.message} />
          )}
        />
        <Controller
          name="address.zip"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="PLZ" error={!!error} helperText={error?.message} />
          )}
        />
        <Controller
          name="address.city"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="Stadt" error={!!error} helperText={error?.message} />
          )}
        />
      </div>
    </Section>
  );
}

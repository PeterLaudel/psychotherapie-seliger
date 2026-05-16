"use client";

import Section from "@/components/section";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useEffect } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { PatientFormData } from "./schema";

export default function BillingSection() {
  const { control, setValue } = useFormContext<PatientFormData>();

  const billingIsPatient = useWatch({ control, name: "billingInfoIsPatient" });
  const [name, surname, email, street, zip, city] = useWatch({
    control,
    name: ["name", "surname", "email", "address.street", "address.zip", "address.city"],
  });

  useEffect(() => {
    if (!billingIsPatient) return;
    setValue("billingInfo.name", name);
    setValue("billingInfo.surname", surname);
    setValue("billingInfo.email", email);
    setValue("billingInfo.address.street", street);
    setValue("billingInfo.address.zip", zip);
    setValue("billingInfo.address.city", city);
  }, [billingIsPatient, name, surname, email, street, zip, city, setValue]);

  return (
    <Section>
      <h2 className="mb-4">Rechnungsdaten</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Controller
            name="billingInfoIsPatient"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox checked={field.value} onChange={field.onChange} />}
                label="Rechnung an Patienten"
              />
            )}
          />
        </div>
        <Controller
          name="billingInfo.name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="Name" disabled={billingIsPatient} error={!!error} helperText={error?.message} />
          )}
        />
        <Controller
          name="billingInfo.surname"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="Nachname" disabled={billingIsPatient} error={!!error} helperText={error?.message} />
          )}
        />
        <Controller
          name="billingInfo.email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} className="col-span-2" label="E-Mail" disabled={billingIsPatient} error={!!error} helperText={error?.message} />
          )}
        />
        <Controller
          name="billingInfo.address.street"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} className="col-span-2" label="Straße" disabled={billingIsPatient} error={!!error} helperText={error?.message} />
          )}
        />
        <Controller
          name="billingInfo.address.zip"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="PLZ" disabled={billingIsPatient} error={!!error} helperText={error?.message} />
          )}
        />
        <Controller
          name="billingInfo.address.city"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="Stadt" disabled={billingIsPatient} error={!!error} helperText={error?.message} />
          )}
        />
      </div>
    </Section>
  );
}

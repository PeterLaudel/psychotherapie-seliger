"use client";

import { Therapeut } from "@/models/therapeut";
import { useActionState, useState } from "react";
import { saveTherapeut } from "./action";
import { Button, TextField } from "@mui/material";
import Section from "@/components/section";
import { validateTherapeut } from "./validateTherapeut";
import { set } from "zod";

interface Props {
  therapeut?: Therapeut;
}

export function TherapeutForm({ therapeut }: Props) {
  const [state, action, pending] = useActionState(saveTherapeut, null);
  const [errors, setErrors] = useState<Partial<Therapeut>>({});

  const handleSubmit = (formData: FormData) => {
    const validationErrors = validateTherapeut(formData);
    if (validationErrors) return setErrors(validationErrors);

    setErrors({});
    return action(formData);
  };

  const fieldProps = (name: keyof Therapeut) => {
    return {
      name,
      defaultValue: therapeut?.[name],
      error: !!errors?.[name],
      helperText: errors?.[name],
    };
  };

  return (
    <div className="grid gap-4 m-4">
      <h1>Therapeut</h1>
      <Section>
        <form action={handleSubmit} className="grid gap-4 grid-cols-2">
          {therapeut?.id && (
            <input type="hidden" name="id" value={therapeut.id} />
          )}
          <TextField label="Titel" {...fieldProps("title")} />
          <TextField
            className="col-start-[1]"
            label="Name"
            {...fieldProps("name")}
          />
          <TextField label="Vorname" {...fieldProps("surname")} />
          <TextField label="Straße" {...fieldProps("street")} />
          <TextField label="PLZ" {...fieldProps("zip")} />
          <TextField label="Ort" {...fieldProps("city")} />
          <TextField label="E-Mail" {...fieldProps("email")} />
          <TextField label="Telefon" {...fieldProps("phone")} />
          <TextField label="Steuer-ID" {...fieldProps("taxId")} />
          <TextField label="Bankname" {...fieldProps("bankName")} />
          <TextField label="IBAN" {...fieldProps("iban")} />
          <TextField label="BIC" {...fieldProps("bic")} />
          <TextField label="Webseite" {...fieldProps("website")} />
          <Button type="submit" variant="contained" disabled={pending}>
            Speichern
          </Button>
          {state?.success && (
            <div style={{ color: "green" }}>{state.message}</div>
          )}
        </form>
      </Section>
    </div>
  );
}

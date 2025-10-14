"use client";

import Section from "@/components/section";
import SubmitButton from "@/components/submitButton";
import { Service } from "@/models/service";
import { TextField } from "@mui/material";
import { useActionState } from "react";
import saveService from "./action";

interface Props {
  service: Service;
}

export default function ServiceForm({ service }: Props) {
  const [state, action, pending] = useActionState(saveService, null);

  return (
    <div className="m-4">
      <h1>Patient</h1>
      <form action={action}>
        <Section>
          <h2>{service.short}</h2>
          <input type="hidden" name="id" value={service.id} />
          <TextField
            name="description"
            label="Beschreibung"
            multiline
            rows={4}
            defaultValue={service.description}
            variant="filled"
            className="w-full"
          />
          <SubmitButton submitting={pending}>Speichern</SubmitButton>
          {state?.success && "Fertsch"}
        </Section>
      </form>
    </div>
  );
}

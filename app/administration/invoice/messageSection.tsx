import { TextField } from "@mui/material";
import { Field, useField } from "react-final-form";
import Section from "../../../components/section";
import { Patient } from "../../../models/patient";

export default function MessageSection() {
  const {
    input: { value: patient },
  } = useField<Patient>("patient", {
    subscription: { value: true },
  });

  return (
    <Section>
      <h2 className="mb-4">Nachricht</h2>
      <div className="grid grid-flow-row gap-4">
        <Field name="message.subject" initialValue={patient && "Rechnung"}>
          {({ input }) => (
            <TextField {...input} disabled={!patient} label="Betreff" />
          )}
        </Field>
        <Field
          name="message.text"
          initialValue={
            patient &&
            `Sehr geehrte Damen und Herren,\n\nanbei sende ich Ihnen die Rechnung für ${patient.name} ${patient.surname}.\n\nMit freundlichen Grüßen\nUte Seliger`
          }
        >
          {({ input }) => (
            <TextField
              {...input}
              disabled={!patient}
              multiline
              minRows={4}
              label="Nachricht"
              className="h-full w-full"
            />
          )}
        </Field>
      </div>
    </Section>
  );
}

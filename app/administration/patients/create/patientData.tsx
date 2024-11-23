import { Field } from "react-final-form";
import Section from "../../../../components/section";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export default function PatientData() {
  return (
    <Section>
      <h2 className="mb-4">Patientendaten</h2>
      <div className="grid grid-cols-2 gap-4">
        <Field name="name">
          {({ input }) => <TextField {...input} label="Vorname" />}
        </Field>
        <Field name="surname">
          {({ input }) => <TextField {...input} label="Nachname" />}
        </Field>
        <Field name="email">
          {({ input }) => <TextField {...input} label="E-Mail" />}
        </Field>
        <Field name="birthdate">
          {({ input }) => (
            <DatePicker
              {...input}
              label="Geburtsdatum"
              value={input.value ? dayjs(input.value) : null}
              onChange={(newValue) => input.onChange(newValue?.toDate())}
              minDate={dayjs.unix(0)}
            />
          )}
        </Field>
      </div>
    </Section>
  );
}

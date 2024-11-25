import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Field } from "react-final-form";
import Section from "../../../../components/section";
import {
  validateDate,
  validateEmail,
  validateName,
  validateSurname,
} from "./validation";

export default function PatientData() {
  return (
    <Section>
      <h2 className="mb-4">Patientendaten</h2>
      <div className="grid grid-cols-2 gap-4">
        <Field name="name" validate={validateName}>
          {({ input, meta: { touched, error } }) => (
            <TextField
              {...input}
              label="Vorname"
              helperText={touched && error}
              error={touched && !!error}
            />
          )}
        </Field>
        <Field name="surname" validate={validateSurname}>
          {({ input, meta: { touched, error } }) => (
            <TextField
              {...input}
              label="Nachname"
              helperText={touched && error}
              error={touched && !!error}
            />
          )}
        </Field>
        <Field name="email" validate={validateEmail}>
          {({ input, meta: { touched, error } }) => (
            <TextField
              {...input}
              label="E-Mail"
              helperText={touched && error}
              error={touched && !!error}
            />
          )}
        </Field>
        <Field name="birthdate" validate={validateDate}>
          {({ input, meta: { touched, error } }) => (
            <DatePicker
              {...input}
              label="Geburtsdatum"
              value={input.value ? dayjs(input.value) : null}
              onChange={(newValue) => input.onChange(newValue?.toDate())}
              minDate={dayjs.unix(0)}
              slotProps={{
                textField: {
                  helperText: touched && error,
                  error: touched && !!error,
                  onBlur: input.onBlur,
                },
              }}
            />
          )}
        </Field>
      </div>
    </Section>
  );
}

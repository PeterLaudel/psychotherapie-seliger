import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Field } from "react-final-form";
import {
  validateCity,
  validateDate,
  validateEmail,
  validateName,
  validateStreet,
  validateSurname,
  validateZip,
} from "./validation";
import Section from "@/components/section";

export default function PatientSection() {
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
              label="Geburtsdatum"
              value={
                input.value
                  ? dayjs(input.value).isValid()
                    ? dayjs(input.value)
                    : null
                  : null
              }
              onChange={(newValue) =>
                input.onChange(newValue ? newValue.format("YYYY-MM-DD") : null)
              }
              minDate={dayjs.unix(0)}
              enableAccessibleFieldDOMStructure={false}
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
        <Field name="diagnosis">
          {({ input, meta: { touched, error } }) => (
            <TextField
              {...input}
              label="Diagnose"
              helperText={touched && error}
              error={touched && !!error}
            />
          )}
        </Field>
        <Field name="address.street" validate={validateStreet}>
          {({ input, meta: { touched, error } }) => (
            <TextField
              {...input}
              label="Straße"
              className="col-span-2"
              helperText={touched && error}
              error={touched && !!error}
            />
          )}
        </Field>
        <Field name="address.zip" validate={validateZip}>
          {({ input, meta: { error, touched } }) => (
            <TextField
              {...input}
              label="PLZ"
              helperText={touched && error}
              error={touched && !!error}
            />
          )}
        </Field>
        <Field name="address.city" validate={validateCity}>
          {({ input, meta: { touched, error } }) => (
            <TextField
              {...input}
              label="Stadt"
              helperText={touched && error}
              error={touched && !!error}
            />
          )}
        </Field>
      </div>
    </Section>
  );
}

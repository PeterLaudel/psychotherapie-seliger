import { TextField } from "@mui/material";
import { Field } from "react-final-form";
import Section from "../../../../components/section";
import { validateStreet, validateZip } from "./validation";

export default function AddressSection() {
  return (
    <Section>
      <h2 className="mb-4">Addresse</h2>
      <div className="grid grid-cols-2 gap-4">
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
        <Field name="address.city" validate={validateStreet}>
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

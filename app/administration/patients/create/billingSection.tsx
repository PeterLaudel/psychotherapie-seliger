import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { Field } from "react-final-form";
import Section from "../../../../components/section";
import {
  SynchronizedField,
  ValueSubscription,
} from "../../../../components/forms";
import {
  validateCity,
  validateEmail,
  validateName,
  validateStreet,
  validateSurname,
  validateZip,
} from "./validation";

export default function BillingSection() {
  return (
    <Section>
      <h2 className="mb-4">Rechnungsdaten</h2>
      <div className="grid grid-cols-2 gap-4">
        <Field<boolean> name="billingInfoIsPatient">
          {({ input }) => (
            <div className="col-span-2">
              <FormControlLabel
                control={<Checkbox {...input} checked={input.value} />}
                label="Rechnung an Patienten"
              />
            </div>
          )}
        </Field>
        <ValueSubscription<boolean> name="billingInfoIsPatient">
          {(billingInfoIsPatient) => (
            <>
              {" "}
              <SynchronizedField<string>
                name="billingInfo.name"
                originFieldName="name"
                synchronize={billingInfoIsPatient}
                validate={validateName}
              >
                {({ input, meta: { touched, error } }) => (
                  <TextField
                    {...input}
                    label="Name"
                    disabled={billingInfoIsPatient}
                    helperText={touched && error}
                    error={touched && !!error}
                  />
                )}
              </SynchronizedField>
              <SynchronizedField<string>
                name="billingInfo.surname"
                originFieldName="surname"
                synchronize={billingInfoIsPatient}
                validate={validateSurname}
              >
                {({ input, meta: { touched, error } }) => (
                  <TextField
                    {...input}
                    label="Nachname"
                    disabled={billingInfoIsPatient}
                    helperText={touched && error}
                    error={touched && !!error}
                  />
                )}
              </SynchronizedField>
              <SynchronizedField<string>
                name="billingInfo.email"
                originFieldName="email"
                synchronize={billingInfoIsPatient}
                validate={validateEmail}
              >
                {({ input, meta: { touched, error } }) => (
                  <TextField
                    {...input}
                    className="col-span-2"
                    label="E-Mail"
                    disabled={billingInfoIsPatient}
                    helperText={touched && error}
                    error={touched && !!error}
                  />
                )}
              </SynchronizedField>
              <SynchronizedField<string>
                name="billingInfo.address.street"
                originFieldName="address.street"
                synchronize={billingInfoIsPatient}
                validate={validateStreet}
              >
                {({ input, meta: { touched, error } }) => (
                  <TextField
                    {...input}
                    className="col-span-2"
                    label="Straße"
                    disabled={billingInfoIsPatient}
                    helperText={touched && error}
                    error={touched && !!error}
                  />
                )}
              </SynchronizedField>
              <SynchronizedField<string>
                originFieldName="address.zip"
                name="billingInfo.address.zip"
                synchronize={billingInfoIsPatient}
                validate={validateZip}
              >
                {({ input, meta: { touched, error } }) => (
                  <TextField
                    {...input}
                    label="PLZ"
                    disabled={billingInfoIsPatient}
                    helperText={touched && error}
                    error={touched && !!error}
                  />
                )}
              </SynchronizedField>
              <SynchronizedField<string>
                originFieldName="address.city"
                name="billingInfo.address.city"
                synchronize={billingInfoIsPatient}
                validate={validateCity}
              >
                {({ input, meta: { touched, error } }) => (
                  <TextField
                    {...input}
                    label="Stadt"
                    disabled={billingInfoIsPatient}
                    helperText={touched && error}
                    error={touched && !!error}
                  />
                )}
              </SynchronizedField>
            </>
          )}
        </ValueSubscription>
      </div>
    </Section>
  );
}

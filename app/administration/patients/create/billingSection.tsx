import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import {
  Field,
  FieldProps,
  FieldRenderProps,
  useField,
  useForm,
} from "react-final-form";
import { useEffect } from "react";
import Section from "../../../../components/section";
import {
  validateCity,
  validateEmail,
  validateName,
  validateStreet,
  validateSurname,
  validateZip,
} from "./validation";

type SunychronizedFieldProps<
  FieldValue,
  RP extends FieldRenderProps<FieldValue, T, InputValue>,
  T extends HTMLElement = HTMLElement,
  InputValue = FieldValue
> = {
  originFieldName: string;
  synchronize: boolean;
} & FieldProps<FieldValue, RP, T, InputValue>;

function SynchronizedField<
  FieldValue,
  T extends HTMLElement = HTMLElement,
  InputValue = FieldValue,
  RP extends FieldRenderProps<FieldValue, T, InputValue> = FieldRenderProps<
    FieldValue,
    T,
    InputValue
  >
>({
  originFieldName,
  synchronize,
  children,
  name,
  ...rest
}: SunychronizedFieldProps<FieldValue, RP, T, InputValue>) {
  const {
    input: { value: originFieldValue },
  } = useField<T>(originFieldName, { subscription: { value: true } });
  const { resetFieldState, change } = useForm();

  useEffect(() => {
    if (synchronize) {
      change(name, originFieldValue);
      resetFieldState(name);
    }
  }, [originFieldValue, synchronize, change, name, resetFieldState]);

  useEffect(() => {
    if (!synchronize) {
      change(name, "");
    }
  }, [synchronize, change, name]);

  //check if children is a function
  if (typeof children === "function")
    return (
      <Field<FieldValue, T, InputValue, RP> name={name} {...rest}>
        {(values) => children(values)}
      </Field>
    );

  return (
    <Field<FieldValue, T, InputValue, RP> name={name} {...rest}>
      {children}
    </Field>
  );
}

export default function BillingSection() {
  const {
    input: { value: billingInfoIsPatient },
  } = useField<boolean>("billingInfoIsPatient", {
    subscription: { value: true },
  });

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
      </div>
    </Section>
  );
}

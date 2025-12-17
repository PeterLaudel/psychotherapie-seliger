import Section from "@/components/section";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { ChangeEvent } from "react";
import { Field, useField } from "react-final-form";

export default function InvoiceSection() {
  const {
    input: { onChange: onChangeInvoicePassword },
  } = useField("invoicePassword");
  const {
    input: { onChange: onChangeEnableInvoiceEncryption },
  } = useField("enableInvoiceEncryption");
  const {
    input: { value: name },
  } = useField("name");
  const {
    input: { value: surname },
  } = useField("surname");
  const {
    input: { value: birthdate },
  } = useField("birthdate");

  const onEnableInvoiceEncryptionChanged = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const enabled = e.target.checked;
    if (enabled) {
      const password = createPassword(name, surname, birthdate);
      onChangeInvoicePassword(password);
    } else {
      onChangeInvoicePassword("");
    }
    onChangeEnableInvoiceEncryption(enabled);
  };

  return (
    <Section>
      <h2 className="mb-4">Rechnungen</h2>
      <div className="grid grid-cols-2 gap-4">
        <Field<boolean> name="enableInvoiceEncryption" type="checkbox">
          {({ input: enableInvoiceEncryptionInput }) => (
            <>
              <FormControlLabel
                label="Rechnung mit Passwort schützen"
                control={
                  <Checkbox
                    {...enableInvoiceEncryptionInput}
                    onChange={onEnableInvoiceEncryptionChanged}
                  />
                }
              />
              <Field<string> name="invoicePassword" defaultValue={null}>
                {({ input: invoicePasswordInput }) => (
                  <TextField
                    {...invoicePasswordInput}
                    disabled={!enableInvoiceEncryptionInput.checked}
                    label="Rechnungspasswort"
                  />
                )}
              </Field>
            </>
          )}
        </Field>
      </div>
    </Section>
  );
}

function createPassword(name?: string, surname?: string, birthdate?: string) {
  return `${name?.at(0) || ""}${surname?.at(0) || ""}${
    birthdate?.replaceAll("-", "") || ""
  }`.toUpperCase();
}

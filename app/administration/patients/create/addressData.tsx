import { Field } from "react-final-form";
import Section from "../../../../components/section";
import { TextField } from "@mui/material";

export default function AddressData() {
  return (
    <Section>
      <h2 className="mb-4">Addresse</h2>
      <div className="grid grid-cols-2 gap-4">
        <Field name="address.street">
          {({ input }) => (
            <TextField {...input} label="Straße" className="col-span-2" />
          )}
        </Field>
        <Field name="address.zip">
          {({ input }) => <TextField {...input} label="PLZ" />}
        </Field>
        <Field name="address.city">
          {({ input }) => <TextField {...input} label="Stadt" />}
        </Field>
      </div>
    </Section>
  );
}

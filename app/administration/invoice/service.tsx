import { FieldArray } from "react-final-form-arrays";
import { Service as ServiceType } from "../../../models/service";
import { Field, useField } from "react-final-form";
import { Fragment } from "react";
import { Position } from "../../../models/invoice";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import { Add } from "@mui/icons-material";
import { IconButton, MenuItem } from "@mui/material";
import Section from "../../../components/section";

import "dayjs/locale/de";

interface Props {
  services: ServiceType[];
}

function InvalidSubscription({
  name,
  children,
}: {
  name: string;
  children: (invalid: boolean) => JSX.Element;
}) {
  const {
    meta: { invalid },
  } = useField(name, { subscription: { invalid: true } });
  return children(!!invalid);
}

function ValueSubscription<T>({
  name,
  children,
}: {
  name: string;
  children: (value: T | undefined) => JSX.Element;
}) {
  const {
    input: { value },
  } = useField<T>(name, { subscription: { value: true } });
  if (!value) return children(undefined);
  return children(value);
}

export default function Service({ services }: Props) {
  const addEntry = (push: (value: Partial<Position>) => void) => {
    push({
      date: undefined,
      service: undefined,
      number: 1,
      factor: undefined,
    });
  };

  return (
    <Section>
      <h2 className="mb-4">Leistungen</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-[2fr_2fr_1fr_1fr_auto] items-start">
        <FieldArray<Partial<Position>> name="positions">
          {({ fields }) =>
            fields.map((name, index) => (
              <Fragment key={name}>
                <Field<Date>
                  key={`${name}.date`}
                  name={`${name}.date`}
                  type="input"
                  validate={(value) =>
                    value ? undefined : "Leistungs Datum wird benötigt"
                  }
                  s
                >
                  {({ input, meta: { error, touched } }) => (
                    <DatePicker
                      label="Leistungs Datum"
                      value={input.value ? dayjs(input.value) : null}
                      onChange={(newValue) =>
                        input.onChange(newValue?.toDate())
                      }
                      minDate={dayjs.unix(0)}
                      slotProps={{
                        textField: {
                          helperText: error && touched ? error : undefined,
                          error: error && touched,
                          onBlur: input.onBlur,
                        },
                      }}
                    />
                  )}
                </Field>
                <Field<ServiceType>
                  key={`${name}.service`}
                  name={`${name}.service`}
                  type="select"
                  validate={(value) =>
                    value ? undefined : "Eine Leistung wird benötigt"
                  }
                >
                  {({ input, meta: { touched, error } }) => (
                    <Autocomplete
                      options={services}
                      onChange={(_, value) => input.onChange(value)}
                      getOptionLabel={(option) => option.short}
                      getOptionKey={(option) => option.short}
                      value={input.value || null}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={touched && error}
                          helperText={touched && error ? error : undefined}
                          label="Leistung"
                          onBlur={input.onBlur}
                        />
                      )}
                    />
                  )}
                </Field>
                <Field<number>
                  key={`${name}.number`}
                  name={`${name}.number`}
                  type="number"
                >
                  {({ input }) => (
                    <InvalidSubscription name={`${name}.service`}>
                      {(invalid: boolean) => (
                        <TextField
                          {...input}
                          type="number"
                          disabled={invalid}
                          label={"Anzahl"}
                          InputProps={{ inputProps: { min: 1 } }}
                        />
                      )}
                    </InvalidSubscription>
                  )}
                </Field>
                <ValueSubscription<ServiceType | undefined>
                  name={`${name}.service`}
                >
                  {(service) => (
                    <Field<string>
                      key={`${name}.factor`}
                      name={`${name}.factor`}
                      type="select"
                      initialValue={Object.keys(service?.amounts || []).at(-1)}
                    >
                      {({ input }) => (
                        <TextField
                          select
                          label="Faktor"
                          disabled={!service}
                          {...input}
                        >
                          {Object.keys(service?.amounts || []).map((factor) => (
                            <MenuItem key={factor} value={factor}>
                              {factor}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    </Field>
                  )}
                </ValueSubscription>
                <div className="flex min-h-14 items-center">
                  <IconButton
                    onClick={() => fields.remove(index)}
                    disabled={fields.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
                {index === (fields.length || 0) - 1 && (
                  <div className="justify-self-start">
                    <IconButton
                      onClick={() => addEntry(fields.push)}
                      size="large"
                    >
                      <Add />
                    </IconButton>
                  </div>
                )}
              </Fragment>
            ))
          }
        </FieldArray>
      </div>
    </Section>
  );
}

import "dayjs/locale/de";

import { Add } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, MenuItem } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Fragment } from "react";
import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { InvoicePositionCreate } from "../../../../repositories/invoicesRepository";
import { PageBreakField } from "./pageBreakField";
import { Service as ServiceType } from "@/models/service";
import Section from "@/components/section";
import { InvalidSubscription, ValueSubscription } from "@/components/forms";

interface Props {
  services: ServiceType[];
}

export default function ServiceSection({ services }: Props) {
  const addEntry = (
    push: (value: Partial<Partial<InvoicePositionCreate>>) => void
  ) => {
    push({
      serviceDate: undefined,
      serviceId: undefined,
      amount: 1,
      factor: undefined,
      pageBreak: false,
    });
  };

  return (
    <Section>
      <h2 className="mb-4">Leistungen</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 lg:grid-cols-[2fr_2fr_1fr_1fr_auto] items-start">
        <FieldArray<Partial<InvoicePositionCreate>> name="invoicePositions">
          {({ fields }) =>
            fields.map((name, index) => (
              <Fragment key={name}>
                {index > 0 && (
                  <div className="col-span-5">
                    <PageBreakField name={name} />
                  </div>
                )}
                <Field<Date>
                  key={`${name}.serviceDate`}
                  name={`${name}.serviceDate`}
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
                <Field<number>
                  key={`${name}.serviceId`}
                  name={`${name}.serviceId`}
                  type="select"
                  validate={(value) =>
                    value ? undefined : "Eine Leistung wird benötigt"
                  }
                >
                  {({ input, meta: { touched, error } }) => (
                    <Autocomplete
                      options={services}
                      onChange={(_, value) => input.onChange(value?.id)}
                      getOptionLabel={(option) => option.short}
                      getOptionKey={(option) => option.short}
                      value={services.find((s) => s.id === input.value) || null}
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
                  key={`${name}.amount`}
                  name={`${name}.amount`}
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
                <ValueSubscription<number | undefined>
                  name={`${name}.serviceId`}
                >
                  {(serviceId) => (
                    <Field<string>
                      key={`${name}.factor`}
                      name={`${name}.factor`}
                      type="select"
                      initialValue={Object.keys(
                        services.find(({ id }) => id === serviceId)?.amounts ||
                          []
                      ).at(-1)}
                    >
                      {({ input }) => (
                        <TextField
                          select
                          label="Faktor"
                          disabled={!serviceId}
                          {...input}
                        >
                          {Object.keys(
                            services.find(({ id }) => id === serviceId)
                              ?.amounts || []
                          ).map((factor) => (
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
                    <IconButton onClick={() => addEntry(fields.push)}>
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

import { FieldArray, FieldArrayRenderProps } from "react-final-form-arrays";
import { Service as ServiceType } from "../../../models/service";
import { Field, useField } from "react-final-form";
import DatePicker from "react-datepicker";
import CreatableSelect from "react-select/creatable";
import { BillEntry } from "./formProps";
import { Fragment } from "react";

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
  const serviceOptions = services.map((service, index) => ({
    label: service.short,
    value: index,
    ...service,
  }));

  const addEntry = (push: (value: BillEntry) => void) => () => {
    push({
      date: undefined,
      service: undefined,
      number: 1,
      factor: undefined,
    });
  };

  return (
    <FieldArray<BillEntry> name="entries">
      {({ fields }) =>
        fields.map((name, index) => (
          <Fragment key={name}>
            <Field<Date>
              key={`${name}.date`}
              name={`${name}.date`}
              type="input"
              validate={(value) => (value ? undefined : "Required")}
            >
              {({ input: { onChange, value } }) => (
                <div>
                  <label htmlFor={`${name}.date`}>Datum</label>
                  <DatePicker
                    id={`${name}.date`}
                    selected={value}
                    onChange={onChange}
                  />
                </div>
              )}
            </Field>
            <Field<ServiceType>
              key={`${name}.service`}
              name={`${name}.service`}
              type="select"
              validate={(value) => (value ? undefined : "Required")}
            >
              {({ input }) => (
                <div>
                  <label htmlFor={`${name}.service`}>Leistung</label>
                  <CreatableSelect<ServiceType>
                    instanceId={input.name}
                    {...input}
                    options={serviceOptions}
                    isClearable={true}
                    isValidNewOption={() => false}
                  />
                </div>
              )}
            </Field>
            <InvalidSubscription name={`${name}.service`}>
              {(invalid: boolean) => (
                <Field<number>
                  key={`${name}.number`}
                  name={`${name}.number`}
                  type="number"
                >
                  {({ input }) => (
                    <div>
                      <label htmlFor={`${name}.number`}>Anzahl</label>
                      <input {...input} min={1} disabled={invalid} />
                    </div>
                  )}
                </Field>
              )}
            </InvalidSubscription>
            <ValueSubscription<ServiceType | undefined>
              name={`${name}.service`}
            >
              {(service) => (
                <Field<number>
                  key={`${name}.factor`}
                  name={`${name}.factor`}
                  type="select"
                >
                  {({ input }) => (
                    <div>
                      <label htmlFor={`${name}.factor`}>Faktor</label>
                      <select {...input} disabled={!service}>
                        {service?.amounts
                          .filter((amount) => amount[1])
                          .map((amount) => (
                            <option key={amount[0]} value={amount[0]}>
                              {amount[0]}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                </Field>
              )}
            </ValueSubscription>
            {(fields.length || 0) > 1 && (
              <button type="button" onClick={() => fields.remove(index)}>
                Entfernen
              </button>
            )}
            {index === (fields.length || 0) - 1 && (
              <button type="button" onClick={() => addEntry(fields.push)}>
                Hinzufügen
              </button>
            )}
          </Fragment>
        ))
      }
    </FieldArray>
  );
}

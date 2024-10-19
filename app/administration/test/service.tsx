import { FieldArray } from "react-final-form-arrays";
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

  return (
    <FieldArray<BillEntry[]> name="entries">
      {({ fields }) =>
        fields.map((name) => (
          <Fragment key={name}>
            <Field<Date>
              key={`${name}.date`}
              name={`${name}.date`}
              type="input"
              validate={(value) => (value ? undefined : "Required")}
            >
              {({ input: { onChange, value } }) => (
                <DatePicker
                  className="border-2"
                  selected={value}
                  onChange={onChange}
                />
              )}
            </Field>
            <Field<ServiceType>
              key={`${name}.service`}
              name={`${name}.service`}
              type="select"
              validate={(value) => (value ? undefined : "Required")}
            >
              {({ input }) => (
                <CreatableSelect<ServiceType>
                  instanceId={input.name}
                  {...input}
                  options={serviceOptions}
                  isClearable={true}
                  isValidNewOption={() => false}
                />
              )}
            </Field>
            <InvalidSubscription name={`${name}.service`}>
              {(invalid: boolean) => (
                <Field<number>
                  key={`${name}.number`}
                  name={`${name}.number`}
                  type="input"
                >
                  {({ input }) => (
                    <input
                      {...input}
                      type="number"
                      className="border-2"
                      min={1}
                      disabled={invalid}
                    />
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
                    <select {...input} className="border-2" disabled={!service}>
                      {service?.amounts
                        .filter((amount) => amount[1])
                        .map((amount) => (
                          <option key={amount[0]} value={amount[0]}>
                            {amount[0]}
                          </option>
                        ))}
                    </select>
                  )}
                </Field>
              )}
            </ValueSubscription>
          </Fragment>
        ))
      }
    </FieldArray>
  );
}

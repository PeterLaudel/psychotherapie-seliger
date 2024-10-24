import { FieldArray } from "react-final-form-arrays";
import Image from "next/image";
import { Service as ServiceType } from "../../../models/service";
import { Field, useField } from "react-final-form";
import DatePicker from "react-datepicker";
import CreatableSelect from "react-select/creatable";
import { Fragment } from "react";
import { Position } from "../../../models/invoice";

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

  const addEntry = (push: (value: Partial<Position>) => void) => {
    push({
      date: undefined,
      service: undefined,
      number: 1,
      factor: undefined,
    });
  };

  return (
    <FieldArray<Partial<Position>> name="positions">
      {({ fields }) =>
        fields.map((name, index) => (
          <Fragment key={name}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
              <Field<Date>
                key={`${name}.date`}
                name={`${name}.date`}
                type="input"
                validate={(value) => (value ? undefined : "Required")}
              >
                {({ input: { onChange, value } }) => (
                  <div className="flex flex-col">
                    <label
                      htmlFor={`${name}.date`}
                      className="mb-1 text-sm font-medium text-gray-700"
                    >
                      Datum
                    </label>
                    <DatePicker
                      id={`${name}.date`}
                      selected={value}
                      onChange={onChange}
                      className="p-2 border border-gray-300 rounded"
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
                  <div className="flex flex-col">
                    <label
                      htmlFor={`${name}.service`}
                      className="mb-1 text-sm font-medium text-gray-700"
                    >
                      Leistung
                    </label>
                    <CreatableSelect<ServiceType>
                      instanceId={input.name}
                      {...input}
                      options={serviceOptions}
                      isClearable={true}
                      isValidNewOption={() => false}
                      className="react-select-container"
                      classNamePrefix="react-select"
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
                      <div className="flex flex-col">
                        <label
                          htmlFor={`${name}.number`}
                          className="mb-1 text-sm font-medium text-gray-700"
                        >
                          Anzahl
                        </label>
                        <input
                          {...input}
                          min={1}
                          disabled={invalid}
                          className="p-2 border border-gray-300 rounded"
                        />
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
                      <div className="flex flex-col">
                        <label
                          htmlFor={`${name}.factor`}
                          className="mb-1 text-sm font-medium text-gray-700"
                        >
                          Faktor
                        </label>
                        <select
                          {...input}
                          disabled={!service}
                          className="p-2 border border-gray-300 rounded"
                        >
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
                <button
                  type="button"
                  onClick={() => fields.remove(index)}
                  className="mt-4 p-2 flex items-center space-x-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  <Image
                    src="/trash.svg"
                    width={16}
                    height={16}
                    alt="Entfernen"
                  />
                </button>
              )}
              {index === (fields.length || 0) - 1 && (
                <button
                  type="button"
                  onClick={() => addEntry(fields.push)}
                  className="mt-4 p-2 flex items-center space-x-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  <Image
                    src="/plus.svg"
                    width={16}
                    height={16}
                    alt="Hinzufügen"
                  />
                </button>
              )}
            </div>
          </Fragment>
        ))
      }
    </FieldArray>
  );
}

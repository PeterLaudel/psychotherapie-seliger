import { FieldArray } from "react-final-form-arrays";
import { Service as ServiceType } from "../../../models/service";
import { Field } from "react-final-form";
import DatePicker from "react-datepicker";
import CreatableSelect from "react-select/creatable";
import { BillEntry } from "./formProps";
import { Fragment } from "react";

interface Props {
  services: ServiceType[];
}

export default function Service({ services }: Props) {
  const serviceOptions = services.map((service) => ({
    label: service.originalGopNr,
    value: service.originalGopNr,
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
            <Field<number>
              key={`${name}.number`}
              name={`${name}.number`}
              type="input"
            >
              {({ input }) => (
                <input {...input} type="number" className="border-2" min={1} />
              )}
            </Field>
            <Field<number>
              key={`${name}.factor`}
              name={`${name}.factor`}
              type="input"
            >
              {({ input }) => (
                <input {...input} type="number" className="border-2" />
              )}
            </Field>
          </Fragment>
        ))
      }
    </FieldArray>
  );
}

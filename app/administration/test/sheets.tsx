"use client";

import { Patient } from "../../../models/patient";
import CreatableSelect from "react-select/creatable";
import { Factor, Service } from "../../../models/service";
import { Field, Form } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import { useMemo } from "react";

interface BillEntry {
  date?: Date;
  service?: Service;
  number?: number;
  factor?: Factor;
}

interface FormProps {
  patient?: Patient;
  entries: BillEntry[];
}

interface Props {
  patients: Patient[];
  services: Service[];
}

export default function Sheets({ patients, services }: Props) {
  const options = patients.map((patient) => ({
    label: `${patient.name} ${patient.surname}`,
    value: patient.id,
    ...patient,
  }));

  const serviceOptions = services.map((service) => ({
    label: service.originalGopNr,
    value: service.originalGopNr,
    ...service,
  }));

  const initialValues = useMemo<FormProps>(
    () => ({
      entries: [
        {
          date: undefined,

          service: undefined,
          number: undefined,
          factor: undefined,
        },
      ],
    }),
    []
  );

  return (
    <div>
      <Form<FormProps>
        onSubmit={() => {}}
        initialValues={initialValues}
        mutators={{
          // potentially other mutators could be merged here
          ...arrayMutators,
        }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field name="patient" type="select">
              {({ input, meta: { touched, error } }) => (
                <CreatableSelect<Patient>
                  instanceId={input.name}
                  {...input}
                  options={options}
                  isClearable={true}
                  isValidNewOption={() => false}
                />
              )}
            </Field>

            <div>Leistungen</div>
            <FieldArray name="entries">
              {({ fields }) => (
                <div>
                  {fields.map((name) => (
                    <Field
                      key={`${name}.service`}
                      name={`${name}.service`}
                      type="select"
                    >
                      {({ input }) => (
                        <CreatableSelect
                          instanceId={input.name}
                          {...input}
                          options={serviceOptions}
                          isClearable={true}
                          isValidNewOption={() => false}
                        />
                      )}
                    </Field>
                  ))}
                </div>
              )}
            </FieldArray>
          </form>
        )}
      </Form>
    </div>
  );
}

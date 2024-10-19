"use client";

import type { Patient as PatientType } from "../../../models/patient";
import type { Service as ServiceType } from "../../../models/service";
import { Form } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Patient from "./patient";
import type { FormProps } from "./formProps";
import Service from "./service";

interface Props {
  patients: PatientType[];
  services: ServiceType[];
}

export default function Sheets({ patients, services }: Props) {
  const initialValues = useMemo<FormProps>(
    () => ({
      entries: [
        {
          date: undefined,
          service: undefined,
          number: 1,
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
          ...arrayMutators,
        }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Patient patients={patients} />
            <div>Leistungen</div>
            <Service services={services} />
          </form>
        )}
      </Form>
    </div>
  );
}

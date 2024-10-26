"use client";

import type { Patient as PatientType } from "../../../models/patient";
import type { Service as ServiceType, Factor } from "../../../models/service";
import { Form } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Patient from "./patient";
import Service from "./service";
import { createInvoice } from "./action";

interface Props {
  patients: PatientType[];
  services: ServiceType[];
}

export interface Position {
  date?: Date;
  service?: ServiceType;
  number: number;
  factor?: Factor;
}

interface FormInvoice {
  patient: PatientType;
  positions: Position[];
}

export default function Sheets({ patients, services }: Props) {
  const initialValues = useMemo<Partial<FormInvoice>>(
    () => ({
      positions: [
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

  const onSubmit = (formValues: FormInvoice) => {
    createInvoice(
      formValues.patient,
      formValues.positions as Required<Position>[]
    );
  };

  return (
    <div>
      <Form<FormInvoice>
        onSubmit={onSubmit}
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
            <input type="submit" value="Submit" />
          </form>
        )}
      </Form>
    </div>
  );
}

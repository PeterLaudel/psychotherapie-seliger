"use client";

import type { Patient as PatientType } from "../../../models/patient";
import type { Service as ServiceType } from "../../../models/service";
import { Form } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Patient from "./patient";
import Service from "./service";
import { Position } from "../../../models/invoice";
import { createInvoice } from "./action";

interface Props {
  patients: PatientType[];
  services: ServiceType[];
}

interface FormInvoice {
  patient?: PatientType;
  positions: Partial<Position>[];
}

export default function Sheets({ patients, services }: Props) {
  const initialValues = useMemo<FormInvoice>(
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

  return (
    <div>
      <Form<FormInvoice>
        onSubmit={() => createInvoice()}
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

"use client";

import type { Patient as PatientType } from "../../../models/patient";
import type { Service as ServiceType, Factor } from "../../../models/service";
import { Form } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { useMemo, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Patient from "./patient";
import Service from "./service";
import { Position as InvoicePosition } from "./invoiceTemplate";
import { createInvoice } from "./action";

interface Props {
  patients: PatientType[];
  services: ServiceType[];
}

interface FormInvoice {
  patient: PatientType;
  positions: Partial<InvoicePosition>[];
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

  const onSubmit = async ({ patient, positions }: FormInvoice) => {
    createInvoice(patient, positions as InvoicePosition[]);
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

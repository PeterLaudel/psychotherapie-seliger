"use client";

import type { Patient as PatientType } from "../../../models/patient";
import type { Service as ServiceType, Factor } from "../../../models/service";
import { Form } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { useMemo, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Patient from "./patient";
import Service from "./service";
import { Invoice } from "./invoice";
import { Position as InvoicePosition } from "./invoice";

interface Props {
  patients: PatientType[];
  services: ServiceType[];
}

interface FormInvoice {
  patient: PatientType;
  positions: Partial<InvoicePosition>[];
}

export default function Sheets({ patients, services }: Props) {
  const [invoiceId, setInvoiceId] = useState<FormInvoice | null>(null);

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
    setInvoiceId({
      patient,
      positions,
    });
  };

  return (
    <div>
      {!invoiceId && (
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
      )}
      {invoiceId && (
        <Invoice
          patient={invoiceId.patient}
          positions={invoiceId.positions as InvoicePosition[]}
        />
      )}
    </div>
  );
}

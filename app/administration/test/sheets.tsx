"use client";

import type { Patient as PatientType } from "../../../models/patient";
import type { Service as ServiceType, Factor } from "../../../models/service";
import { Form } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { useMemo, useState } from "react";
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
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

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

  const onSubmit = async (formValues: FormInvoice) => {
    const invoiceId = await createInvoice(
      formValues.patient,
      formValues.positions as Required<Position>[]
    );
    setInvoiceId(invoiceId);
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
        <div className="h-[100vh] w-[100vw]">
          <iframe
            src={`https://drive.google.com/file/d/${invoiceId}/preview`}
            height={"100%"}
            width={"100%"}
          />
        </div>
      )}
    </div>
  );
}

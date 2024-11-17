"use client";

import type { Patient as PatientType } from "../../../models/patient";
import type { Service as ServiceType, Factor } from "../../../models/service";
import { Form } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { useMemo } from "react";
import Patient from "./patient";
import Service from "./service";
import { Position as InvoicePosition } from "./invoiceTemplate";
import { createInvoice } from "./action";
import Section from "../../../components/section";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { deDE } from "@mui/x-date-pickers/locales";

interface Props {
  patients: PatientType[];
  services: ServiceType[];
}

interface FormInvoice {
  patient: PatientType;
  positions: Partial<InvoicePosition>[];
}

export default function InvoiceForm({ patients, services }: Props) {
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
    <Form<FormInvoice>
      onSubmit={onSubmit}
      initialValues={initialValues}
      mutators={{
        ...arrayMutators,
      }}
    >
      {({ handleSubmit }) => (
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="de"
          localeText={
            deDE.components.MuiLocalizationProvider.defaultProps.localeText
          }
        >
          <form onSubmit={handleSubmit}>
            <Section>
              <Patient patients={patients} />
              <div>Leistungen</div>
              <Service services={services} />
            </Section>
            <input type="submit" value="Submit" />
          </form>
        </LocalizationProvider>
      )}
    </Form>
  );
}

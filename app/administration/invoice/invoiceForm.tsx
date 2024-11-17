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
import { Button } from "@mui/material";

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
          <form
            onSubmit={handleSubmit}
            className="grid m-4 grid-flow-row gap-4"
          >
            <h1>Rechnung erstellen</h1>
            <Section>
              <h2 className="mb-4">Patient</h2>
              <Patient patients={patients} />
            </Section>
            <Section>
              <h2 className="mb-4">Leistungen</h2>
              <Service services={services} />
            </Section>
            <div className="justify-self-start">
              <Button type="submit" variant="contained">
                Rechnung erstellen
              </Button>
            </div>
          </form>
        </LocalizationProvider>
      )}
    </Form>
  );
}

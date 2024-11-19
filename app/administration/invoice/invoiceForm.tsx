"use client";

import type { Patient as PatientType } from "../../../models/patient";
import type { Service as ServiceType } from "../../../models/service";
import { Form, FormSpy } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { useMemo } from "react";
import Patient from "./patient";
import Service from "./service";
import CompleteDocument, {
  Position as InvoicePosition,
} from "./invoiceTemplate";
import { createInvoice } from "./action";
import Section from "../../../components/section";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { deDE } from "@mui/x-date-pickers/locales";
import { Button, CircularProgress } from "@mui/material";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("./pdfViewer"), {
  ssr: false,
});

interface Props {
  patients: PatientType[];
  services: ServiceType[];
}

interface FormInvoice {
  patient: PatientType;
  diagnosis: string;
  positions: Partial<InvoicePosition>[];
}

export default function InvoiceForm({ patients, services }: Props) {
  const initialValues = useMemo<Partial<FormInvoice>>(
    () => ({
      diagnosis: "",
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

  const onSubmit = async ({ patient, diagnosis, positions }: FormInvoice) => {
    await createInvoice(patient, diagnosis, positions as InvoicePosition[]);
  };

  return (
    <Form<FormInvoice>
      onSubmit={onSubmit}
      initialValues={initialValues}
      mutators={{
        ...arrayMutators,
      }}
    >
      {({ handleSubmit, submitting, submitSucceeded }) => (
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="de"
          localeText={
            deDE.components.MuiLocalizationProvider.defaultProps.localeText
          }
        >
          <div className="grid grid-cols-2 gap-4 h-full">
            <form
              onSubmit={handleSubmit}
              className="grid m-4 grid-flow-row gap-4 h-fit"
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
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting || submitSucceeded}
                >
                  {(submitting || submitSucceeded) && (
                    <CircularProgress size={18} />
                  )}
                  Rechnung erstellen
                </Button>
              </div>
            </form>
            <FormSpy<FormInvoice> subscription={{ values: true }}>
              {({ values }) => (
                <PDFViewer className="w-full h-full">
                  <CompleteDocument
                    patient={values.patient}
                    diagnoses={values.diagnosis}
                    positions={
                      values.positions.filter(
                        ({ service, date }) => service && date
                      ) as InvoicePosition[]
                    }
                  />
                </PDFViewer>
              )}
            </FormSpy>
          </div>
        </LocalizationProvider>
      )}
    </Form>
  );
}

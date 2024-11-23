"use client";

import type { Patient as PatientType } from "../../../models/patient";
import type { Service as ServiceType } from "../../../models/service";
import { Form } from "react-final-form";
import { FormApi } from "final-form";
import arrayMutators from "final-form-arrays";
import { useCallback, useMemo, useState } from "react";
import Patient from "./patient";
import Service from "./service";
import { Position as InvoicePosition } from "./invoiceTemplate";
import { createInvoice } from "./action";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { deDE } from "@mui/x-date-pickers/locales";
import InvoiceViewer from "./invoiceViewer";
import SuccessMessage from "../../../components/successMessage";
import SubmitButton from "../../../components/submitButton";

interface Props {
  patients: PatientType[];
  services: ServiceType[];
}

export interface FormInvoice {
  patient: PatientType;
  diagnosis: string;
  positions: Partial<InvoicePosition>[];
}

export default function InvoiceForm({ patients, services }: Props) {
  const [open, showSuccessMessage] = useState(false);
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

  const onSubmit = useCallback(
    async (
      { patient, diagnosis, positions }: FormInvoice,
      form: FormApi<FormInvoice, Partial<FormInvoice>>
    ) => {
      await createInvoice(patient, diagnosis, positions as InvoicePosition[]);
      showSuccessMessage(true);
      form.restart(initialValues);
    },
    [initialValues]
  );

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="de"
      localeText={
        deDE.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <Form<FormInvoice>
        onSubmit={onSubmit}
        initialValues={initialValues}
        mutators={{
          ...arrayMutators,
        }}
      >
        {({ handleSubmit, submitting, submitSucceeded }) => (
          <div className="grid grid-cols-2 gap-4 h-full">
            <form
              onSubmit={handleSubmit}
              className="grid m-4 grid-flow-row gap-4 h-fit"
            >
              <h1>Rechnung erstellen</h1>
              <Patient patients={patients} />
              <Service services={services} />
              <SubmitButton
                submitting={submitting || submitSucceeded}
                className="justify-self-start self-center"
              >
                Rechnung erstellen
              </SubmitButton>
            </form>
            <InvoiceViewer />
          </div>
        )}
      </Form>
      <SuccessMessage open={open} onClose={() => showSuccessMessage(false)}>
        Rechnung wurde versendet
      </SuccessMessage>
    </LocalizationProvider>
  );
}

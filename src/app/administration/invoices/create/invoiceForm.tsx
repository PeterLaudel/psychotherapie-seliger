"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { deDE } from "@mui/x-date-pickers/locales";
import { FormApi } from "final-form";
import arrayMutators from "final-form-arrays";
import { useCallback, useMemo, useState } from "react";
import { Form } from "react-final-form";
import { createInvoice } from "./action";
import PatientSection from "./patientSection";
import ServiceSection from "./serviceSection";
import InvoiceViewer from "./invoiceViewer";
import { InvoicePosition } from "@/models/invoicePosition";
import {
  InvoiceCreate,
  InvoicePositionCreate,
} from "@/repositories/invoicesRepository";
import type { Service as ServiceType } from "@/models/service";
import type { Patient as PatientType } from "@/models/patient";
import SuccessMessage from "@/components/successMessage";
import SubmitButton from "@/components/submitButton";

interface Props {
  patients: PatientType[];
  services: ServiceType[];
  invoiceNumber: string;
}

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type FormInvoice = DeepPartial<InvoiceCreate> & {
  diagnosis?: string;
  base64Pdf?: string;
  invoicePositions: DeepPartial<InvoicePositionCreate>[];
};

export default function InvoiceForm({
  patients,
  services,
  invoiceNumber,
}: Props) {
  const [open, showSuccessMessage] = useState(false);
  const initialValues = useMemo<
    DeepPartial<FormInvoice> & {
      invoicePositions: DeepPartial<
        Omit<InvoicePosition, "invoiceId" | "id">
      >[];
    }
  >(
    () => ({
      invoiceNumber,
      invoicePositions: [
        {
          serviceDate: undefined,
          serviceId: undefined,
          amount: 1,
          factor: undefined,
          pageBreak: false,
        },
      ],
    }),
    [invoiceNumber]
  );

  const onSubmit = useCallback(
    async (
      values: FormInvoice,
      form: FormApi<FormInvoice, Partial<FormInvoice>>
    ) => {
      const {diagnosis, ...rest} = values;
      await createInvoice(rest as InvoiceCreate);
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
          <div className="grid grid-cols-2 gap-4 h-full overflow-hidden">
            <div className="overflow-auto h-full">
              <form
                onSubmit={handleSubmit}
                className="grid m-4 grid-flow-row gap-4 h-fit"
              >
                <h1>Rechnung erstellen</h1>
                <PatientSection patients={patients} />
                <ServiceSection services={services} />
                <SubmitButton
                  submitting={!!submitting || !!submitSucceeded}
                  className="justify-self-start self-center"
                >
                  Rechnung versenden
                </SubmitButton>
              </form>
            </div>
            <InvoiceViewer
              patients={patients}
              services={services}
              invoiceNumber={invoiceNumber}
            />
          </div>
        )}
      </Form>
      <SuccessMessage open={open} onClose={() => showSuccessMessage(false)}>
        Rechnung wurde erstellt
      </SuccessMessage>
    </LocalizationProvider>
  );
}

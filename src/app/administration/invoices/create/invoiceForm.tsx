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
import ServiceSection, { InvoicePosition } from "./serviceSection";
import InvoiceViewer from "./invoiceViewer";
import { Service } from "@/models/service";
import { Patient } from "@/models/patient";
import SuccessMessage from "@/components/successMessage";
import SubmitButton from "@/components/submitButton";
import { Therapeut } from "@/models/therapeut";

interface Props {
  patients: Patient[];
  services: Service[];
  therapeut: Therapeut;
  invoiceNumber: string;
}

export type FormInvoice = {
  patient?: Patient;
  diagnosis?: string;
  invoicePositions: InvoicePosition[];
  invoiceAmount?: number;
  base64Pdf?: string;
  invoiceNumber: string;
};

export default function InvoiceForm({
  patients,
  services,
  invoiceNumber,
  therapeut,
}: Props) {
  const [open, showSuccessMessage] = useState(false);
  const initialValues = useMemo<Partial<FormInvoice>>(
    () => ({
      invoiceNumber,
      invoicePositions: [
        {
          serviceDate: undefined,
          service: undefined,
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
      await createInvoice({
        patientId: values.patient!.id,
        invoiceNumber: values.invoiceNumber,
        base64Pdf: values.base64Pdf!,
        invoiceAmount: values.invoicePositions.reduce(
          (sum, pos) => sum + pos.price!,
          0
        ),
        status: "pending",
      });
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
              therapeut={therapeut}
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

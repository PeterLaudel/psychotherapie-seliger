"use client";

import "dayjs/locale/de";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { deDE } from "@mui/x-date-pickers/locales";
import { useCallback, useMemo } from "react";
import { Form } from "react-final-form";
import PatientSection from "./patientSection";
import BillingSection from "./billingSection";
import { Patient } from "@/models/patient";
import SubmitButton from "@/components/submitButton";
import { useSnackbar } from "@/contexts/snackbarProvider";
import { useRouter } from "next/navigation";
import { PatientSave } from "@/repositories/patientsRepository";
import { billingInfoIsPatient } from "./billingInfoIsPatient";
import InvoiceSection from "./invoiceSection";

type PatientFormData = PatientSave & {
  billingInfoIsPatient: boolean;
  enableInvoiceEncryption: boolean;
};

interface Props {
  action: (patient: PatientSave) => void;
  initialValues?: Patient;
}

export default function PatientForm({
  initialValues: initialValuesProps,
  action,
}: Props) {
  const { showSuccessMessage } = useSnackbar();
  const router = useRouter();

  const initialValues = useMemo<Partial<PatientFormData>>(
    () => ({
      ...initialValuesProps,
      billingInfoIsPatient: billingInfoIsPatient(initialValuesProps),
      enableInvoiceEncryption: initialValuesProps?.invoicePassword !== null,
    }),
    [initialValuesProps]
  );

  const onSubmit = useCallback(
    (values: PatientFormData) => {
      const {
        billingInfoIsPatient,
        enableInvoiceEncryption,
        invoicePassword,
        ...patientData
      } = values;
      action({
        id: values.id,
        invoicePassword: invoicePassword || null,
        ...patientData,
      });
      showSuccessMessage("Patient wurde angelegt");
      router.push("/administration/patients");
    },
    [showSuccessMessage, router, action]
  );

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="de"
      localeText={
        deDE.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <Form<PatientFormData> onSubmit={onSubmit} initialValues={initialValues}>
        {({ handleSubmit, submitSucceeded, submitting }) => (
          <form
            onSubmit={handleSubmit}
            className="grid grid-flow-row m-4 gap-4 h-fit"
          >
            <h1>Patient anlegen</h1>
            <PatientSection />
            <BillingSection />
            <InvoiceSection />
            <SubmitButton
              submitting={!!submitting || !!submitSucceeded}
              className="justify-self-start self-center"
            >
              {initialValuesProps ? "Speichern" : "Anlegen"}
            </SubmitButton>
          </form>
        )}
      </Form>
    </LocalizationProvider>
  );
}

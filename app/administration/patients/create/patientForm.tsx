"use client";

import "dayjs/locale/de";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { deDE } from "@mui/x-date-pickers/locales";
import { FormApi } from "final-form";
import { useCallback, useMemo } from "react";
import { Form } from "react-final-form";
import SubmitButton from "../../../../components/submitButton";
import { Patient } from "../../../../models/patient";
import createPatient from "./action";
import PatientSection from "./patientSection";
import BillingSection from "./billingSection";

type FormData = Patient & { billingInfoIsPatient: boolean };

export default function PatientForm() {
  const initialValues = useMemo<Partial<FormData>>(
    () => ({
      billingInfoIsPatient: true,
    }),
    []
  );
  const onSubmit = useCallback(
    async (values: FormData, form: FormApi<FormData, Partial<FormData>>) => {
      await createPatient(values);
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
      <Form<FormData> onSubmit={onSubmit} initialValues={initialValues}>
        {({ handleSubmit, submitting }) => (
          <form
            onSubmit={handleSubmit}
            className="grid grid-flow-row m-4 gap-4 h-fit"
          >
            <h1>Patient anlegen</h1>
            <PatientSection />
            <BillingSection />
            <SubmitButton
              submitting={submitting}
              className="justify-self-start self-center"
            >
              Patient anlegen
            </SubmitButton>
          </form>
        )}
      </Form>
    </LocalizationProvider>
  );
}

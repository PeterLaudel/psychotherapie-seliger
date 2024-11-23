"use client";

import { useCallback, useMemo } from "react";
import { Form } from "react-final-form";
import { FormApi } from "final-form";
import { Patient } from "../../../../models/patient";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { deDE } from "@mui/x-date-pickers/locales";
import PatientData from "./patientData";
import AddressData from "./addressData";
import createPatient from "./action";
import { Button, CircularProgress } from "@mui/material";

import "dayjs/locale/de";

export default function PatientForm() {
  const initialValues = useMemo<Partial<Patient>>(() => ({}), []);
  const onSubmit = useCallback(
    async (values: Patient, form: FormApi<Patient, Partial<Patient>>) => {
      await createPatient(values);
      form.restart(initialValues);
    },
    []
  );

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="de"
      localeText={
        deDE.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <Form<Patient> onSubmit={onSubmit} initialValues={initialValues}>
        {({ handleSubmit, submitting }) => (
          <form
            onSubmit={handleSubmit}
            className="grid grid-flow-row m-4 gap-4 h-fit"
          >
            <h1>Patient anlegen</h1>
            <PatientData />
            <AddressData />
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              className="justify-self-start self-center"
            >
              {submitting && <CircularProgress size={18} className="mr-2" />}
              Patient anlegen
            </Button>
          </form>
        )}
      </Form>
    </LocalizationProvider>
  );
}

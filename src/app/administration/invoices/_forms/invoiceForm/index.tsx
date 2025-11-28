"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { deDE } from "@mui/x-date-pickers/locales";
import arrayMutators from "final-form-arrays";
import { useCallback, useMemo } from "react";
import { Form } from "react-final-form";
import PatientSection from "./patientSection";
import ServiceSection, { InvoicePosition } from "./serviceSection";
import InvoiceViewer from "./invoiceViewer";
import { Service } from "@/models/service";
import { Patient } from "@/models/patient";
import SubmitButton from "@/components/submitButton";
import { Therapeut } from "@/models/therapeut";
import { InvoiceSave } from "@/repositories/invoicesRepository";
import { useSnackbar } from "@/contexts/snackbarProvider";
import { Invoice } from "@/models/invoice";
import { useRouter } from "next/navigation";

interface Props {
  invoiceId?: number;
  action: (invoice: InvoiceSave) => Promise<Invoice>;
  patients: Patient[];
  services: Service[];
  therapeut: Therapeut;
  invoiceNumber: string;
  initialValues?: Required<FormInvoice>;
}

export type FormInvoice = {
  patient?: Patient;
  invoicePositions: InvoicePosition[];
  invoiceAmount?: number;
  base64Pdf?: string;
  invoiceNumber: string;
};

export default function InvoiceForm({
  invoiceId,
  action,
  patients,
  services,
  invoiceNumber,
  therapeut,
  initialValues: initialValuesProps,
}: Props) {
  const router = useRouter();
  const { showSuccessMessage } = useSnackbar();
  const initialValues = useMemo<Partial<FormInvoice>>(() => {
    if (initialValuesProps) return initialValuesProps;

    return {
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
    };
  }, [invoiceNumber, initialValuesProps]);

  const onSubmit = useCallback(
    async (values: FormInvoice) => {
      const invoice = await action({
        id: invoiceId,
        patient: values.patient!,
        invoiceNumber: values.invoiceNumber,
        base64Pdf: values.base64Pdf!,
        invoiceAmount: values.invoicePositions.reduce(
          (sum, pos) => sum + pos.price!,
          0
        ),
        status: "pending",
        positions: values.invoicePositions.map((position) => ({
          serviceDate: position.serviceDate!,
          service: position.service!,
          amount: position.amount,
          factor: position.factor!,
          pageBreak: position.pageBreak!,
        })),
      });
      showSuccessMessage("Rechnung wurde gespeichert");

      router.push(`/administration/invoices/${invoice.id}`);
    },
    [action, invoiceId, router, showSuccessMessage]
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
        {({ handleSubmit, submitting }) => (
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
                  submitting={!!submitting}
                  className="justify-self-start self-center"
                >
                  {initialValues ? "Speichern" : "Anlegen"}
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
    </LocalizationProvider>
  );
}

import dynamic from "next/dynamic";
import { FormSpy } from "react-final-form";

import { FormInvoice } from "./invoiceForm";
import CompleteDocument from "./invoiceTemplate";
import { Position as InvoicePosition } from "./invoiceTemplate";

const PDFViewer = dynamic(() => import("./pdfViewer"), {
  ssr: false,
});

export default function InvoiceViewer() {
  return (
    <FormSpy<FormInvoice> subscription={{ values: true }}>
      {({ values }) => (
        <PDFViewer className="w-full h-full" key={values.patient?.id}>
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
  );
}

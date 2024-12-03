import dynamic from "next/dynamic";
import { useFormState } from "react-final-form";
import { FormInvoice } from "./invoiceForm";
import InvoiceTemplate from "./invoiceTemplate";
import { toInvoiceParameters } from "./toInvoiceParameters";

const PDFViewer = dynamic(() => import("./pdfViewer"), {
  ssr: false,
});

export default function InvoiceViewer() {
  const { values } = useFormState<FormInvoice>({
    subscription: { values: true },
  });

  const invoiceParameters = toInvoiceParameters(values);

  return (
    <PDFViewer className="w-full h-full" key={values.patient?.id}>
      <InvoiceTemplate {...invoiceParameters} />
    </PDFViewer>
  );
}

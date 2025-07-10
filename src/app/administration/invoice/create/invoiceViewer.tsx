import dynamic from "next/dynamic";
import { useFormState } from "react-final-form";
import { FormInvoice } from "./invoiceForm";
import InvoiceTemplate from "./invoiceTemplate";
import { InvoicePosition } from "@/models/invoicePosition";
import { Service } from "@/models/service";
import { Patient } from "@/models/patient";

interface Props {
  patients: Patient[];
  services: Service[];
  invoiceNumber: string;
}

const PDFViewer = dynamic(() => import("./pdfViewer"), {
  ssr: false,
});

export default function InvoiceViewer({
  patients,
  services,
  invoiceNumber,
}: Props) {
  const { values } = useFormState<FormInvoice>({
    subscription: { values: true },
  });

  const patient = patients.find((p) => p.id === values.patientId);
  const diagnosis = values.diagnosis;
  const filteredPositions = values.invoicePositions.filter(
    (position): position is InvoicePosition =>
      !!position &&
      !!position.serviceDate &&
      !!position.serviceId &&
      !!position.factor &&
      !!position.amount
  );

  const mappedPositions = filteredPositions.map((position) => {
    const service = services.filter((s) => s.id === position.serviceId)[0];
    return {
      ...position,
      service,
      price:
        position?.factor !== undefined
          ? service?.amounts.find((amount) => amount.factor === position.factor)
              ?.price ?? 0
          : 0,
    };
  });

  return (
    <PDFViewer className="w-full h-full" key={patient?.id}>
      <InvoiceTemplate
        invoiceNumber={invoiceNumber}
        billingInfo={patient?.billingInfo}
        diagnosis={diagnosis}
        patient={patient}
        positions={mappedPositions}
      />
    </PDFViewer>
  );
}

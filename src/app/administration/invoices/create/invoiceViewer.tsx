import { useEffect, useMemo } from "react";
import { useField, useFormState } from "react-final-form";
import type { FormInvoice } from "./invoiceForm";
import { usePdf } from "./_hooks/usePdf";
import { Patient } from "@/models/patient";
import type { InvoicePosition } from "./serviceSection";

interface Props {
  patients: Patient[];
  invoiceNumber: string;
}

export default function InvoiceViewer({
  patients,
  invoiceNumber,
}: Props) {
  const {
    input: { onChange },
  } = useField<string>("base64Pdf");
  const { values } = useFormState<FormInvoice>({
    subscription: { values: true },
  });
  const mappedPositions = useMemo(
    () =>
      values?.invoicePositions
        .filter(
          (position): position is Required<InvoicePosition> =>
            !!position &&
            !!position.serviceDate &&
            !!position.service &&
            !!position.factor &&
            !!position.amount
        )
        .map((position, index) => {
          const service = position.service;
          return {
            ...position,
            id: index,
            service,
            price: service?.amounts.find(
                  (amount) => amount.factor === position.factor
                )?.price ?? 0
          };
        }),
    [values?.invoicePositions]
  );

  const base64Pdf = usePdf({
    invoiceNumber: invoiceNumber,
    patient: patients.find((p) => p.id === values?.patientId),
    positions: mappedPositions || [],
    diagnosis: values?.diagnosis,
  });

  const url = useMemo(() => {
    if (!base64Pdf) return null;
    const buffer = Buffer.from(base64Pdf, "base64");
    const blobWithXml = new Blob([buffer], { type: "application/pdf" });
    return URL.createObjectURL(blobWithXml);
  }, [base64Pdf]);

  useEffect(() => onChange(base64Pdf || ""), [base64Pdf, onChange]);

  if (base64Pdf === null || url === null) {
    return null;
  }

  return <iframe className="w-full h-full" key={values?.patientId} src={url} />;
}

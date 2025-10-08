import { useEffect, useMemo } from "react";
import { useField, useFormState } from "react-final-form";
import type { FormInvoice } from "./invoiceForm";
import { usePdf } from "./_hooks/usePdf";
import { Patient } from "@/models/patient";
import type { InvoicePosition } from "./serviceSection";
import { Therapeut } from "@/models/therapeut";

interface Props {
  patients: Patient[];
  therapeut: Therapeut;
  invoiceNumber: string;
}

export default function InvoiceViewer({
  patients,
  therapeut,
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
            !!position.amount &&
            !!position.price
        )
        .map((position, index) => (
          {
            id: index,
            ...position,
          }
        )),
    [values?.invoicePositions]
  );

  const base64Pdf = usePdf({
    therapeut,
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

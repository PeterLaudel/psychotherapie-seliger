import { useEffect, useMemo } from "react";
import { useField, useFormState } from "react-final-form";
import type { FormInvoice } from "./invoiceForm";
import { usePdf } from "./_hooks/usePdf";
import { InvoicePosition } from "@/models/invoicePosition";
import { Service } from "@/models/service";
import { Patient } from "@/models/patient";

interface Props {
  patients: Patient[];
  services: Service[];
  invoiceNumber: string;
}

export default function InvoiceViewer({
  patients,
  services,
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
          (position): position is InvoicePosition =>
            !!position &&
            !!position.serviceDate &&
            !!position.serviceId &&
            !!position.factor &&
            !!position.amount
        )
        .map((position) => {
          const service = services.filter(
            (s) => s.id === position.serviceId
          )[0];
          return {
            ...position,
            id: position.id ?? 0,
            service,
            price:
              position?.factor !== undefined
                ? service?.amounts.find(
                    (amount) => amount.factor === position.factor
                  )?.price ?? 0
                : 0,
          };
        }),
    [services, values?.invoicePositions]
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

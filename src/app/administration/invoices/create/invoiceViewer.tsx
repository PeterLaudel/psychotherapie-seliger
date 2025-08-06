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
      values.invoicePositions
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
    [services, values.invoicePositions]
  );

  const data = useMemo(() => {
    return {
      invoiceNumber: invoiceNumber,
      patient: patients.find((p) => p.id === values.patientId),
      mappedPositions,
      diagnosis: values.diagnosis,
    };
  }, [
    invoiceNumber,
    mappedPositions,
    patients,
    values.diagnosis,
    values.patientId,
  ]);

  const base64Pdf = usePdf(data);

  const url = useMemo(() => {
    if (!base64Pdf) return null;
    const blobWithXml = new Blob([base64Pdf], { type: "application/pdf" });
    return URL.createObjectURL(blobWithXml);
  }, [base64Pdf]);

  useEffect(() => {
    if (base64Pdf) {
      onChange(base64Pdf || "");
    }
  }, [base64Pdf, onChange]);

  if (base64Pdf === null || url === null) {
    return null;
  }

  return (
    <iframe
      className="w-full h-full"
      key={patients.find((p) => p.id === values.patientId)?.id}
      src={url}
    />
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { useFormState } from "react-final-form";
import type { FormInvoice } from ".";
import type { InvoicePosition } from "./serviceSection";
import { Therapeut } from "@/models/therapeut";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import { CreatePdfParams } from "./_hooks/createPdf";

interface Props {
  therapeut: Therapeut;
  invoiceNumber: string;
}

export default function InvoiceViewer({ therapeut, invoiceNumber }: Props) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Viewer therapeut={therapeut} invoiceNumber={invoiceNumber} />
    </QueryClientProvider>
  );
}

function Viewer({ therapeut, invoiceNumber }: Props) {
  const timeoutId = useRef<null | ReturnType<typeof setTimeout>>(null);
  const [data, setData] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: (postData: CreatePdfParams) => {
      return fetch("/api/invoices/generate", {
        method: "POST",
        body: JSON.stringify(postData),
      }).then(async (res) => {
        const data = await res.blob();
        setData(URL.createObjectURL(data));
      });
    },
  });
  const { values } = useFormState<FormInvoice>({
    subscription: { values: true },
  });

  const stringifiedPositions = JSON.stringify(values?.invoicePositions);
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
        .map((position, index) => ({
          id: index,
          ...position,
        })) || [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stringifiedPositions]
  );

  const stringifiedMappedPositions = JSON.stringify(mappedPositions);
  useEffect(() => {
    if (timeoutId.current !== null) clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(
      () =>
        mutation.mutate({
          therapeut,
          invoiceNumber,
          patient: values?.patient,
          positions: mappedPositions,
        }),
      500
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [therapeut, invoiceNumber, values?.patient, stringifiedMappedPositions]);

  if (!data) {
    return null;
  }

  return (
    <iframe key={values?.patient?.id} src={data} className="w-full h-full" />
  );
}

import { useField } from "react-final-form";
import { useEffect } from "react";
import { Invoice } from "@/models/invoice";

export function InvoiceAmount() {
  const {
    input: { value: invoicePositions },
  } = useField<Partial<Invoice["positions"]>>("invoicePositions", {
    subscription: { value: true },
  });
  const {
    input: { onChange },
  } = useField<Invoice["invoiceAmount"]>("invoiceAmount");

  const stringifiedPositions = JSON.stringify(invoicePositions);

  useEffect(() => {
    const total = (invoicePositions || []).reduce(
      (prev, entry) => prev + (entry?.price || 0),
      0
    );
    onChange(total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedPositions, onChange]);

  return <></>;
}

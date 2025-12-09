import { useField, useFormState } from "react-final-form";
import { useEffect } from "react";
import { FormInvoice } from ".";

export function InvoiceAmount() {
  const { values } = useFormState<FormInvoice>();
  const {
    input: { onChange },
  } = useField<number>("invoiceAmount");

  const stringifiedPositions = JSON.stringify(values?.invoicePositions);

  useEffect(() => {
    const total = (values?.invoicePositions || []).reduce(
      (prev, { price }) => prev + (price || 0),
      0
    );
    onChange(total);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedPositions, onChange]);

  return <></>;
}

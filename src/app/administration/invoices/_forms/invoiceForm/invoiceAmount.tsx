"use client";

import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { FormInvoice } from ".";

export function InvoiceAmount() {
  const { control, setValue } = useFormContext<FormInvoice>();
  const invoicePositions = useWatch({ control, name: "invoicePositions" });

  const stringifiedPositions = JSON.stringify(invoicePositions);

  useEffect(() => {
    const total = invoicePositions.reduce((prev, entry) => prev + (entry?.price ?? 0), 0);
    setValue("invoiceAmount", total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedPositions, setValue]);

  return null;
}

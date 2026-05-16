"use client";

import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { FormInvoice } from ".";

interface Props {
  index: number;
}

export function Price({ index }: Props) {
  const { control, setValue } = useFormContext<FormInvoice>();
  const factor = useWatch({ control, name: `invoicePositions.${index}.factor` });
  const service = useWatch({ control, name: `invoicePositions.${index}.service` });
  const amount = useWatch({ control, name: `invoicePositions.${index}.amount` });

  useEffect(() => {
    if (service && factor) {
      const unitPrice = service.amounts.find((a) => a.factor === factor)?.price ?? 0;
      setValue(`invoicePositions.${index}.price`, unitPrice * amount);
    } else {
      setValue(`invoicePositions.${index}.price`, undefined);
    }
  }, [service, factor, amount, index, setValue]);

  return null;
}

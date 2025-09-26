import { useField } from "react-final-form";
import type { InvoicePosition } from "./serviceSection";
import { useEffect } from "react";

interface Props {
    name: string;
}

export function Price({ name }: Props) {
    const { input: { value, onChange } } = useField<InvoicePosition>(name, { subscription: { value: true } });

    useEffect(() => {
        if (value?.service && value?.factor) {
            const price = value.service.amounts.find(amount => amount.factor === value.factor)?.price || 0;
            onChange({ ...value, price: price * value.amount });
        } else {
            onChange({ ...value, price: 0 });
        }
    }, [value?.service, value?.factor, value?.amount, onChange]);

    return <></>
}
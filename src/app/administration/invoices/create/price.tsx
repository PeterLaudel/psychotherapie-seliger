import { useField } from "react-final-form";
import type { InvoicePosition } from "./serviceSection";
import { useEffect } from "react";

interface Props {
    name: string;
}

export function Price({ name }: Props) {
    const { input: { value: factor } } = useField<InvoicePosition['factor']>(`${name}.factor`, { subscription: { value: true } });
    const { input: { value: service } } = useField<InvoicePosition['service']>(`${name}.service`, { subscription: { value: true } });
    const { input: { value: amount } } = useField<InvoicePosition['amount']>(`${name}.amount`, { subscription: { value: true } });
    const { input: { onChange } } = useField<InvoicePosition['price']>(`${name}.price`);

    useEffect(() => {
        if (service && factor) {
            const price = service.amounts.find(amount => amount.factor === factor)?.price || 0;
            onChange(price * amount);
        } else {
            onChange(undefined)
        }
    }, [service, factor, amount, onChange]);

    return <></>
}
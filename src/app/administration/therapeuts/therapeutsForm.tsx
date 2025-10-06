"use client";

import { Therapeut } from "@/models/therapeut";
import { useActionState } from "react";
import { saveTherapeut } from "./action";
import { Button, TextField } from "@mui/material";
import Section from "@/components/section";

interface Props {
    therapeut?: Therapeut;
}

export function TherapeutsForm({ therapeut }: Props) {
    const [state, action, pending] = useActionState(saveTherapeut, therapeut || null);

    return (
        <Section>
            <form action={action} className="grid gap-4 grid-cols-2">
                <TextField name="title" label="Titel" defaultValue={state?.title} />
                <div />
                <TextField name="name" label="Name" defaultValue={state?.name} />
                <TextField name="surename" label="Vorname" defaultValue={state?.surname} />
                <TextField name="street" label="Straße" defaultValue={state?.street} />
                <TextField name="zip" label="PLZ" defaultValue={state?.zip} />
                <TextField name="city" label="Ort" defaultValue={state?.city} />
                <TextField name="email" label="E-Mail" defaultValue={state?.email} />
                <TextField name="phone" label="Telefon" defaultValue={state?.phone} />
                <TextField name="taxId" label="Steuer-ID" defaultValue={state?.taxId} />
                <TextField name="bankName" label="Bankname" defaultValue={state?.bankName} />
                <TextField name="iban" label="IBAN" defaultValue={state?.iban} />
                <TextField name="bic" label="BIC" defaultValue={state?.bic} />
                <TextField name="website" label="Webseite" defaultValue={state?.website} />
                <Button type="submit" variant="contained" disabled={pending}>
                    Speichern
                </Button>
            </form>
        </Section>
    );
}
import { Therapeut } from "@/models/therapeut";
import * as z from "zod";

const schema = z.object({
  title: z.string().min(1, "Titel ist erforderlich"),
  name: z.string().min(1, "Name ist erforderlich"),
  surname: z.string().min(1, "Vorname ist erforderlich"),
  street: z.string().min(1, "Straße ist erforderlich"),
  zip: z.string().min(1, "PLZ ist erforderlich"),
  city: z.string().min(1, "Ort ist erforderlich"),
  email: z.email("E-Mail ist ungültig"),
  phone: z.string().min(1, "Telefon ist erforderlich"),
  taxId: z.string().min(1, "Steuer-ID ist erforderlich"),
  bankName: z.string().min(1, "Bankname ist erforderlich"),
  iban: z.string().min(1, "IBAN ist erforderlich"),
  bic: z.string().min(1, "BIC ist erforderlich"),
  website: z.string().min(1, "Webseite ist ungültig"),
  enr: z.string().min(1, "ENR ist erforderlich"),
});

export function validateTherapeut(data: FormData) {
  const object = Object.fromEntries(data.entries());
  const result = schema.safeParse(object);

  if (result.success) return;
  const treeifiedErrors = z.treeifyError(result.error);
  const entries = Object.entries(treeifiedErrors.properties || {});
  return entries.reduce<Partial<Therapeut>>(
    (current, [key, value]) => ({ ...current, [key]: value.errors[0] }),
    {}
  );
}

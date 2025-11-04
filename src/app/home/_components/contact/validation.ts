import * as z from "zod";

const contactFormSchema = z.object({
  name: z.string().min(1, "Bitte geben Sie Ihren Namen ein."),
  surname: z.string().min(1, "Bitte geben Sie Ihren Nachnamen ein."),
  email: z.email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  message: z.string().min(1, "Bitte geben Sie eine Nachricht ein."),
  payment: z.string().min(1, "Bitte wählen Sie eine Zahlungsart aus."),
});

export const validateContactForm = (formData: FormData) => {
  const result = contactFormSchema.safeParse(Object.fromEntries(formData));
  if (result.success) return;

  const treeifiedErrors = z.treeifyError(result.error);
  const entries = Object.entries(treeifiedErrors.properties || {});
  return entries.reduce<
    Partial<Record<keyof z.infer<typeof contactFormSchema>, string>>
  >((current, [key, value]) => ({ ...current, [key]: value.errors[0] }), {});
};

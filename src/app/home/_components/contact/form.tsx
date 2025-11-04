"use client";

import {
  FormEvent,
  ReactNode,
  startTransition,
  useActionState,
  useState,
} from "react";
import Spinner from "./spinner";
import { validateContactForm } from "./validation";

interface ContactFormValues {
  name?: string;
  surname?: string;
  email?: string;
  message?: string;
  payment?: string;
}

const contactEndpoint = () => process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "";

function Error({ children }: { children: ReactNode }) {
  return <div className="text-red-500 text-sm">{children}</div>;
}

type ActionState = null | {
  success: boolean;
};

export default function Form() {
  const [state, action, pending] = useActionState(formAction, null);
  const [validationErrors, setValidationErrors] = useState<
    Partial<ContactFormValues> | undefined
  >(undefined);

  async function formAction(state: ActionState, formData: FormData) {
    const values = Object.fromEntries(formData.entries()) as ContactFormValues;
    const validationErrors = validateContactForm(formData);
    if (validationErrors) {
      setValidationErrors(validationErrors);
      return { success: false };
    }
    const searchParams = new URLSearchParams({
      action: "contactRequest",
    }).toString();
    const response = await fetch(contactEndpoint() + "?" + searchParams, {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (response.ok) return { success: true };

    return {
      success: false,
    };
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    setValidationErrors(undefined);
    e.preventDefault();
    startTransition(() => {
      action(new FormData(e.currentTarget));
    });
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md grid gap-4">
        <h1 className="text-2xl font-bold">Termin anfragen</h1>
        <div className="my-1">
          Bitte beschreiben Sie kurz Ihr Anliegen. Geben Sie uns bitte außerdem
          an, in welchen Zeiträumen Therapiesitzungen stattfinden könnten.
        </div>

        <label className="grid">
          <div className="font-bold text-lg">Vorname</div>
          <input
            name="name"
            className="border-2 border-gray-300 p-2 rounded-md"
          />
          {validationErrors?.name && <Error>{validationErrors.name}</Error>}
        </label>

        <label className="grid">
          <div className="font-bold text-lg">Nachname</div>
          <input
            name="surname"
            className="border-2 border-gray-300 p-2 rounded-md"
          />
          {validationErrors?.surname && (
            <Error>{validationErrors.surname}</Error>
          )}
        </label>

        <label className="grid">
          <div className="font-bold text-lg">Email</div>
          <input name="email" className="border-2 p-2 rounded-md" />
          {validationErrors?.email && <Error>{validationErrors.email}</Error>}
        </label>

        <label className="grid">
          <div className="text-lg font-bold">Nachricht</div>
          <textarea
            name="message"
            placeholder="Bitte beschreiben Sie Ihr Anliegen und nennen Sie Ihre Verfügbarkeit"
            className="border-2 p-2 rounded-md"
          />
          {validationErrors?.message && (
            <Error>{validationErrors.message}</Error>
          )}
        </label>

        <label className="grid">
          <div className="text-lg font-bold">Bezahlung</div>
          <select
            name="payment"
            className="border-2 p-2 rounded-md bg-white"
            defaultValue=""
          >
            <option hidden value=""></option>
            <option value="privatversichert">Privatversichert</option>
            <option value="beihilfe">Beihilfe</option>
            <option value="heilfürsorge">Heilfürsorge</option>
            <option value="selbstzahler">Selbstzahler</option>
          </select>
          {validationErrors?.payment && (
            <Error>{validationErrors.payment}</Error>
          )}
        </label>

        <div className="grid">
          <button
            type="submit"
            disabled={pending || state?.success}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
          >
            {pending && <Spinner />}
            Absenden
          </button>
          {state?.success && (
            <div className="text-green-500">
              Vielen Dank für Ihre Anfrage. Wir werden uns in Kürze bei Ihnen
              melden.
            </div>
          )}
          {validationErrors !== undefined && (
            <Error>{"Formular unvollständig"}</Error>
          )}
          {validationErrors === undefined && state && !state.success && (
            <Error>{"Ein Fehler ist aufgetreten"}</Error>
          )}
        </div>
      </form>
    </div>
  );
}

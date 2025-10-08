"use client";

import { FORM_ERROR } from "final-form";
import { ReactNode, useMemo } from "react";
import { Field, Form as FinalForm } from "react-final-form";
import Spinner from "./spinner";
import {
  validateEmail,
  validateMessage,
  validateName,
  validatePayment,
  validateSurname,
} from "./validations";

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

export default function Form() {
  const initialValues: ContactFormValues = useMemo(
    () => ({
      payment: "",
    }),
    []
  );

  const onSubmit = async (values: ContactFormValues) => {
    const searchParams = new URLSearchParams({
      action: "contactRequest",
    }).toString();
    const response = await fetch(contactEndpoint() + "?" + searchParams, {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (response.ok) return;

    return {
      [FORM_ERROR]: "Ein Fehler ist aufgetreten",
    };
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <FinalForm<ContactFormValues>
        onSubmit={onSubmit}
        initialValues={initialValues}
      >
        {({
          hasValidationErrors,
          submitFailed,
          handleSubmit,
          submitSucceeded,
          submitting,
        }) => (
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <h1 className="text-2xl font-bold">Termin anfragen</h1>
            <h2 className="text-lg font-bold my-3 text-red-600">
              Freie Termine verfübar ab Oktober 2025.
            </h2>
            <div className="my-5">
              Bitte beschreiben Sie kurz Ihr Anliegen. Geben Sie uns bitte
              außerdem an, in welchen Zeiträumen Therapiesitzungen stattfinden
              könnten.
            </div>
            <Field name="name" validate={validateName} type="text">
              {({ input, meta: { touched, error } }) => (
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor={input.name}
                    className="mb-2 font-bold text-lg text-gray-900"
                  >
                    Vorname
                  </label>
                  <input
                    {...input}
                    className="border-2 border-gray-300 p-2 rounded-md"
                  />
                  {touched && error && <Error>{error}</Error>}
                </div>
              )}
            </Field>

            <Field name="surname" validate={validateSurname} type="text">
              {({ input, meta: { touched, error } }) => (
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor={input.name}
                    className="mb-2 font-bold text-lg text-gray-900"
                  >
                    Nachname
                  </label>
                  <input
                    {...input}
                    className="border-2 border-gray-300 p-2 rounded-md"
                  />
                  {touched && error && <Error>{error}</Error>}
                </div>
              )}
            </Field>

            <Field name="email" validate={validateEmail} type="text">
              {({ input, meta: { touched, error } }) => (
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor={input.name}
                    className="mb-2 font-bold text-lg text-gray-900"
                  >
                    Email
                  </label>
                  <input
                    {...input}
                    className="border-2 border-gray-300 p-2 rounded-md"
                  />
                  {touched && error && <Error>{error}</Error>}
                </div>
              )}
            </Field>

            <Field name="message" validate={validateMessage} type="textarea">
              {({ input, meta: { touched, error } }) => (
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor={input.name}
                    className="mb-2 font-bold text-lg text-gray-900"
                  >
                    Nachricht
                  </label>
                  <textarea
                    {...input}
                    placeholder="Bitte beschreiben Sie Ihr Anliegen und nennen Sie Ihre Verfügbarkeit"
                    className="border-2 border-gray-300 p-2 rounded-md"
                  />
                  {touched && error && <Error>{error}</Error>}
                </div>
              )}
            </Field>

            <Field name="payment" type="select" validate={validatePayment}>
              {({ input, meta: { touched, error } }) => (
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor={input.name}
                    className="mb-2 font-bold text-lg text-gray-900"
                  >
                    Bezahlung
                  </label>
                  <select
                    {...input}
                    className="border-2 border-gray-300 p-2 rounded-md bg-white"
                  >
                    <option disabled value=""></option>
                    <option value="privatversichert">Privatversichert</option>
                    <option value="beihilfe">Beihilfe</option>
                    <option value="heilfürsorge">Heilfürsorge</option>
                    <option value="selbstzahler">Selbstzahler</option>
                  </select>
                  {touched && error && <Error>{error}</Error>}
                </div>
              )}
            </Field>

            <div className="flex flex-col">
              <button
                type="submit"
                disabled={submitting || submitSucceeded}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
              >
                {submitting && <Spinner />}
                Absenden
              </button>
              {submitSucceeded && (
                <div className="text-green-500">
                  Vielen Dank für Ihre Anfrage. Wir werden uns in Kürze bei
                  Ihnen melden.
                </div>
              )}
              {hasValidationErrors && submitFailed && (
                <Error>{"Formular unvollständig"}</Error>
              )}
              {!hasValidationErrors && submitFailed && (
                <Error>{"Ein Fehler ist aufgetreten"}</Error>
              )}
            </div>
          </form>
        )}
      </FinalForm>
    </div>
  );
}

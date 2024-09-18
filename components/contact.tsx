import { useMemo } from "react";
import { Field, Form } from "react-final-form";

interface ContactFormValues {
  name?: string;
  surname?: string;
  email?: string;
  message?: string;
  payment?: string;
  privacy: boolean;
}

const required = (value?: string) =>
  value ? undefined : "Dieser Eintrag wird benötigt";

function Error({ children }: { children: React.ReactNode }) {
  return <div className="text-red-500 text-sm">{children}</div>;
}

export function Contact() {
  const onSubmit = (values: ContactFormValues) => {};

  return (
    <div className="flex flex-col items-center justify-center">
      <Form<ContactFormValues> onSubmit={onSubmit}>
        {({ handleSubmit, hasValidationErrors, submitFailed }) => (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white p-6"
          >
            <h1 className="text-2xl font-bold">Termin anfragen</h1>
            <div className="my-5">
              Bitte beschrieben Sie kurz Ihr Anliegen. Geben Sie uns bitte
              außerdem an, in welchen Zeiträumen Therapiesitzungen stattfinden
              könnten.
            </div>
            <Field name="name" validate={required} type="text">
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

            <Field name="surname" validate={required} type="text">
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

            <Field name="email" validate={required} type="text">
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

            <Field name="message" validate={required} type="textarea">
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

            <Field name="payment" allowNull={true} type="select">
              {({ input, meta }) => (
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
                    <option value="privatversichert">Privatversichert</option>
                    <option value="beihilfe">Beihilfe</option>
                    <option value="heilfürsorge">Heilfürsorge</option>
                    <option value="selbstzahler">Selbstzahler</option>
                  </select>
                </div>
              )}
            </Field>

            <Field name="privacy" validate={required} type="checkbox">
              {({ input, meta }) => (
                <div className="flex items-center mb-4">
                  <input {...input} className="mr-2" />
                  <label htmlFor={input.name} className="text-lg text-gray-900">
                    Datenschutz
                  </label>
                </div>
              )}
            </Field>

            <div className="flex flex-row items-center gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
              >
                Absenden
              </button>
              {hasValidationErrors && submitFailed && (
                <Error>{"Formular unvollständig"}</Error>
              )}
            </div>
          </form>
        )}
      </Form>
    </div>
  );
}
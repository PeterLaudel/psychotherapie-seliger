import { useMemo } from "react";
import { Field, Form } from "react-final-form";

interface ContactFormValues {
  name?: string;
  surname?: string;
  email?: string;
  phonenumber?: string;
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-2">
      <h1 className="text-2xl font-bold mb-5">Kontakt</h1>
      <Form<ContactFormValues> onSubmit={onSubmit}>
        {({ handleSubmit, hasValidationErrors, submitFailed }) => (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white p-6 rounded-md shadow-md"
          >
            <Field name="name" validate={required}>
              {({ input, meta: { touched, error } }) => (
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor="vorname"
                    className="mb-2 font-bold text-lg text-gray-900"
                  >
                    Vorname
                  </label>
                  <input
                    {...input}
                    type="text"
                    name="vorname"
                    className="border-2 border-gray-300 p-2 rounded-md"
                  />
                  {touched && error && <Error>{error}</Error>}
                </div>
              )}
            </Field>

            <Field name="surname" validate={required}>
              {({ input, meta: { touched, error } }) => (
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor="nachname"
                    className="mb-2 font-bold text-lg text-gray-900"
                  >
                    Nachname
                  </label>
                  <input
                    {...input}
                    type="text"
                    name="nachname"
                    className="border-2 border-gray-300 p-2 rounded-md"
                  />
                  {touched && error && <Error>{error}</Error>}
                </div>
              )}
            </Field>

            <Field name="email" validate={required}>
              {({ input, meta: { touched, error } }) => (
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor="email"
                    className="mb-2 font-bold text-lg text-gray-900"
                  >
                    Email
                  </label>
                  <input
                    {...input}
                    type="text"
                    name="email"
                    className="border-2 border-gray-300 p-2 rounded-md"
                  />
                  {touched && error && <Error>{error}</Error>}
                </div>
              )}
            </Field>

            <Field name="phonenumber" validate={required}>
              {({ input, meta: { touched, error } }) => (
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor="phonenumber"
                    className="mb-2 font-bold text-lg text-gray-900"
                  >
                    Telefonnummer
                  </label>
                  <input
                    {...input}
                    type="text"
                    name="phonenumber"
                    className="border-2 border-gray-300 p-2 rounded-md"
                  />
                  {touched && error && <Error>{error}</Error>}
                </div>
              )}
            </Field>

            <Field name="message" validate={required}>
              {({ input, meta: { touched, error } }) => (
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor="nachricht"
                    className="mb-2 font-bold text-lg text-gray-900"
                  >
                    Nachricht
                  </label>
                  <textarea
                    {...input}
                    name="nachricht"
                    className="border-2 border-gray-300 p-2 rounded-md"
                  ></textarea>
                  {touched && error && <Error>{error}</Error>}
                </div>
              )}
            </Field>

            <Field name="payment" allowNull={true} type="select">
              {({ input, meta }) => (
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor="bezahlung"
                    className="mb-2 font-bold text-lg text-gray-900"
                  >
                    Bezahlung
                  </label>
                  <select
                    {...input}
                    name="bezahlung"
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

            <Field name="privacy" validate={required}>
              {({ input, meta }) => (
                <div className="flex items-center mb-4">
                  <input
                    {...input}
                    name={"datenschutz"}
                    type="checkbox"
                    className="mr-2"
                  />
                  <label
                    htmlFor="datenschutz"
                    className="text-lg text-gray-900"
                  >
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

import Image from "next/image";
import Address from "./address";
import Email from "./email";
import Form from "./form";
import PhoneNumber from "./phonenumber";
import { ConsentGoogleMapsFrame } from "./consentGoogleMapsFrame";

export default function Contact() {
  return (
    <div>
      <div className="relative bg-white shadow-xl">
        <h2 className="sr-only">Kontaktinformationen</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="relative overflow-hidden py-10 px-6 bg-gray-200 sm:px-10 xl:p-12">
            <div className="relative">
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                Kontaktinformationen
              </h3>
              <dl className="mt-8 space-y-6 text-base text-gray-500">
                <div>
                  <dt className="sr-only">Adresse</dt>
                  <dd className="flex">
                    <Image
                      src="/house.svg"
                      alt="Symbol für Adresse"
                      width="0"
                      height="0"
                      sizes="100%"
                      className="w-auto h-6"
                    />
                    <div className="flex flex-col ml-3">
                      <Address />
                    </div>
                  </dd>
                </div>
                <ConsentGoogleMapsFrame />
                <div>
                  <dt className="sr-only">Telefonnummer</dt>
                  <dd className="flex">
                    <Image
                      src="/phone.svg"
                      alt="Symbol für Telefonnummer"
                      width="0"
                      height="0"
                      sizes="100%"
                      className="w-auto h-6 mr-3"
                    />
                    <PhoneNumber />
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">Email</dt>
                  <dd className="flex">
                    <Image
                      src="/email.svg"
                      alt="Symbol für Email"
                      width="0"
                      height="0"
                      sizes="100%"
                      className="w-auto h-6 mr-3"
                    />
                    <Email />
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div
            className="py-10 px-6 sm:px-10 lg:col-span-2 xl:p-12"
            id="kontakt_formular"
          >
            <Form />
          </div>
        </div>
      </div>
    </div>
  );
}

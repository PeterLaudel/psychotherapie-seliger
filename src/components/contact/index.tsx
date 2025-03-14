import Image from "next/image";
import Address from "./address";
import Email from "./email";
import Form from "./form";
import PhoneNumber from "./phonenumber";

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
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19938.110177165818!2d12.322077279101553!3d51.343060099999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2f6adde980e3097d%3A0xc7bbc36db54d6411!2sUte%20Seliger%2C%20M.Sc.%20-%20Psych.%20%7C%20Praxis%20f%C3%BCr%20Psychotherapie%20-%20Seliger%20%7C!5e0!3m2!1sde!2sde!4v1726413366495!5m2!1sde!2sde"
                  width="0"
                  height="0"
                  loading="lazy"
                  className="w-full h-64"
                ></iframe>
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

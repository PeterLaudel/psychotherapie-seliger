"use client";

import Image from "next/image";
import Navbar from "../components/navbar";
import Link from "next/link";
import { Contact } from "../components/contact";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="flex h-[30vh] md:h-[80vh] bg-[url('/psychotherapie-seliger/raum.jpg')] bg-cover bg-center md:bg-fixed text-white">
        <div className="m-auto grid-flow-row">
          <h1 className="text-2xl md:text-7xl [text-shadow:_1px_1px_1px_rgb(0_0_0_/_20%)]">
            Praxis für Psychotherapie
          </h1>
        </div>
      </div>

      {/* über mich */}
      <section id="about_me" className="image-text">
        <div className="image">
          <Image
            src="/psychotherapie-seliger/person.jpg"
            alt="Foto von Ute Seliger"
            width={0}
            height={0}
            sizes="100%"
            className="h-auto max-h-[70vh] w-auto rounded-[50%]"
          />
        </div>
        <div className="text">
          <div className="pb-4">
            <h1>Ute Seliger</h1>
            <h4>Psychologische Psychotherapeutin in Verhaltenstherapie</h4>
          </div>
          <ul className="list-disc space-y-2 pl-5">
            <li>Studium der Psychologie (M.Sc.) </li>
            <li>
              5-jährige Ausbildung zur Psychologischen Psychotherapeutin in
              Verhaltenstherapie
            </li>
            <li>seit 2017 therapeutische Tätigkeit im ambulanten Setting</li>
            <li>2015-2016 Psychologin in Rehaklinik</li>
            <li>2016-2020 Psychologin in psychiatrischer Klinik</li>
            <li>2021 approbierte psychologische Psychotherapeutin</li>
            <li>seit 2021 therapeutische Tätigkeit in Online-Therapie</li>
            <li>seit 2024 Privatpraxis</li>
          </ul>
        </div>
      </section>

      {/* Therapie */}
      <section id="therapie" className="text-image">
        <div className="image">
          <Image
            src="/psychotherapie-seliger/filler.png"
            alt="Füllbild was den verlauf der Therapie darstellt"
            width={0}
            height={0}
            sizes="100%"
            className="h-auto max-h-[70vh] w-auto rounded-[40%]"
          />
        </div>
        <div className="text">
          <h3 className="pb-2">Ablauf der Therapie</h3>
          <div className="py-4">Einzeltherapie: 50 Minuten</div>
          <div>
            <ul className="space-y-4">
              <li className="space-y-2">
                <div className="font-bold">
                  1 Kennlernenphase - Diagnostik und Zielsetzung
                </div>
                <div>
                  In den ersten 5 Gesprächen (Probatorik) werden wir uns
                  kennenlernen. Wir betrachten dabei gemeinsam die Einflüsse,
                  die ihre Probleme verursachen und aufrechterhalten. Zudem
                  werden wir konkrete Therapieziele festlegen.
                </div>
              </li>
              <li className="space-y-2">
                <div className="font-bold">
                  2 Therapiephase - Prozess der Veränderung
                </div>
                <div>
                  Auf Basis der Therapieziele wenden wir uns nun den nötigen
                  Schritten zu, um Veränderungen schaffen zu können. Dabei
                  kommen verschiedene psychotherapeutische Methoden zum Einsatz,
                  welche innerhalb der Therapiesitzung, als auch zwischen den
                  Sitzungen umgesetzt werden. Im engen Austausch beleuchten wir,
                  was für Sie funktioniert und was nicht.
                </div>
              </li>
              <li className="space-y-2">
                <div className="font-bold">3 Abschlussphase - Abschied</div>
                <div>
                  Immer mehr schaffen Sie es, die gewünschte Veränderung
                  aufrechtzuerhalten und die Erkenntnisse aus der Therapie in
                  ihren Alltag zu integrieren. Es wird nun Zeit, die
                  Sitzungsfrequenz zu reduzieren.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Behandlungsspektrum */}
      <section id="behandlungsspektrum" className="image-text">
        <div className="image">
          <Image
            src="/psychotherapie-seliger/brain.png"
            alt="Füllbild was das Behandlungsspektrum darstellt"
            width={0}
            height={0}
            sizes="100%"
            className="h-auto max-h-[70vh] w-auto rounded-[40%]"
          />
        </div>
        <div className="text">
          <h3 className="pb-2 underline">Behandlungsspektrum</h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>Beziehungs- und Interaktionsstörungen</li>
            <li>Anpassungsstörung</li>
            <li>Depression</li>
            <li>Bipolare Störung</li>
            <li>Zwangsstörung</li>
            <li>Panik und Agoraphobie</li>
            <li>Soziale Phobie</li>
            <li>Generalisierte</li>
            <li>Angststörung</li>
            <li>Somatoforme</li>
            <li>Störungen</li>
            <li>Essstörung</li>
          </ul>
        </div>
      </section>

      {/* Kosten */}
      <section id="kosten">
        <div className="mb-8">
          <h2 className="pb-2">Kosten der Therapie</h2>
          <p className="text-lg leading-relaxed">
            Die Abrechnung in meiner Praxis erfolgt gemäß den aktuellen{" "}
            <a
              href="https://api.bptk.de/uploads/Uebersicht_Analogleistungen_gemaess_Abrechnungsempfehlungen_B_Pt_K_B_Ae_K_PKV_Beihilfe_2024_07_01_5d59d963de.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Abrechnungsempfehlungen der Bundespsychotherapeutenkammer fürg
              Privatversicherte und Beihilfeberechtigte (Stand: 01.07.2024)
            </a>
            . Die genauen Kosten hängen von der jeweiligen Therapieleistung ab
            und orientieren sich an den empfohlenen Sätzen. Für weitere
            Informationen stehe ich Ihnen gerne zur Verfügung.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Therapie möglich für:</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Privatversicherte</li>
            <li>Beihilfefähige</li>
            <li>Heilfürsorgeberechtigte</li>
            <li>Selbstzahler*innen</li>
          </ul>
        </div>
      </section>

      {/* Kontakt */}
      <section id="kontakt" className="bg-white">
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
                        src="/psychotherapie-seliger/house.svg"
                        alt="Symbol für Adresse"
                        width="0"
                        height="0"
                        sizes="100%"
                        className="w-auto h-6"
                      />
                      <div className="flex flex-col">
                        <span className="ml-3">Friedrich-Ebert-Str. 98</span>
                        <span className="ml-3">04105 Leipzig</span>
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
                        src="/psychotherapie-seliger/phone.svg"
                        alt="Symbol für Telefonnummer"
                        width="0"
                        height="0"
                        sizes="100%"
                        className="w-auto h-6"
                      />
                      <span className="ml-3">+49 123 456789</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="sr-only">Email</dt>
                    <dd className="flex">
                      <Image
                        src="/psychotherapie-seliger/email.svg"
                        alt="Symbol für Email"
                        width="0"
                        height="0"
                        sizes="100%"
                        className="w-auto h-6"
                      />
                      <span className="ml-3">fake@example.com</span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div
              className="py-10 px-6 sm:px-10 lg:col-span-2 xl:p-12"
              id="kontakt_formular"
            >
              <Contact />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <Link href="/impressum">Impressum</Link>
        <Link href="/datenschutz">Datenschutz</Link>
      </footer>
    </main>
  );
}

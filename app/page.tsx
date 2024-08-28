import Image from "next/image";
import Navbar from "../components/navbar";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="flex h-[30vh] md:h-[80vh] bg-[url('/psychotherapie-seliger/raum2.jpg')] bg-cover bg-center md:bg-fixed text-white">
        <div className="m-auto grid-flow-row [text-shadow:_1px_1px_1px_rgb(0_0_0_/_20%)]">
          <div className="text-2xl md:text-7xl">Praxis für Psychotherapie</div>
        </div>
      </div>
      <div id="about_me" className="px-20 py-16 bg-regular-green ">
        <div className="grid grid-flow-row md:grid-flow-col md:gap-8 items-center justify-items-center">
          <div>
            <Image
              src="/psychotherapie-seliger/person.jpg"
              alt="Person"
              width={0}
              height={0}
              sizes="100%"
              className="h-auto max-h-[70vh] w-auto rounded-[50%]"
            />
          </div>
          <div>
            <div className="pb-4">
              <div className="text-4xl">Ute Seliger</div>
              <div className="text-xl">
                Psychologische Psychotherapeutin in Verhaltenstherapie
              </div>
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
        </div>
      </div>
      <div id="therapie" className="px-20 py-16">
        <div className="grid grid-flow-row md:grid-flow-col md:gap-8 items-center justify-items-center">
          <div>
            <Image
              src="/psychotherapie-seliger/filler.png"
              alt="Person"
              width={0}
              height={0}
              sizes="100%"
              className="h-auto max-h-[70vh] w-auto rounded-[40%]"
            />
          </div>
          <div>
            <div className="text-2xl pb-2">Ablauf der Therapie</div>
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
                    kommen verschiedene psychotherapeutische Methoden zum
                    Einsatz, welche innerhalb der Therapiesitzung, als auch
                    zwischen den Sitzungen umgesetzt werden. Im engen Austausch
                    beleuchten wir, was für Sie funktioniert und was nicht.
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
        </div>
      </div>
      <div id="behandlungsspektrum" className="px-20 py-16 bg-regular-green">
        <div className="grid grid-flow-row md:grid-flow-col md:gap-8 items-center justify-items-center">
          <div>
            <div className="text-2xl pb-2 underline">Behandlungsspektrum</div>
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
          <div>
            <Image
              src="/psychotherapie-seliger/brain.png"
              alt="Person"
              width={0}
              height={0}
              sizes="100%"
              className="h-auto max-h-[70vh] w-auto rounded-[40%]"
            />
          </div>
        </div>
      </div>
      <div id="kosten" className="px-20 py-16 bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
          <div>
            <h2 className="text-2xl pb-2 underline font-bold">
              Kosten der Therapie
            </h2>
            <p>
              Die Abrechnung in meiner Praxis erfolgt gemäß den aktuellen{" "}
              <a
                href="https://api.bptk.de/uploads/Uebersicht_Analogleistungen_gemaess_Abrechnungsempfehlungen_B_Pt_K_B_Ae_K_PKV_Beihilfe_2024_07_01_5d59d963de.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Abrechnungsempfehlungen der Bundespsychotherapeutenkammer für
                Privatversicherte und Beihilfeberechtigte (Stand: 01.07.2024)
              </a>
              . Die genauen Kosten hängen von der jeweiligen Therapieleistung ab
              und orientieren sich an den empfohlenen Sätzen. Für weitere
              Informationen stehe ich Ihnen gerne zur Verfügung.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-xl">Therapie möglich für:</h3>
            <ul className="list-disc pl-5">
              <li>Privatversicherte</li>
              <li>Beihilfefähige</li>
              <li>Heilfürsorgeberechtigte</li>
              <li>Selbstzahler*innen</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex bg-black p-8 text-white gap-4 justify-end">
        <Link href="/impressum">Impressum</Link>
        <Link href="/datenschutz">Datenschutz</Link>
      </div>
    </main>
  );
}

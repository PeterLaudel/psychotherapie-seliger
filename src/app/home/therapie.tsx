import Image from "next/image";

export default function Therapie() {
  return (
    <div className="text-image">
      <div className="image w-full h-auto md:h-full md:w-[30vw]">
        <Image
          src="/filler.jpeg"
          alt="Füllbild was den Verlauf der Therapie darstellt"
          width={0}
          height={0}
          sizes="100%"
          className="w-full h-auto aspect-[6/9] rounded-[40%]"
        />
      </div>
      <div className="text">
        <h2>Mein Angebot</h2>
        <div className="pb-4">
          Ich biete Verhaltenstherapie für Erwachsene im Einzelgespräch an.
        </div>
        <div className="pb-4">
          Die typische Sitzungsfrequenz liegt bei einmal pro Woche à 50 Minuten.
        </div>
        <h3 className="pb-2">Ablauf der Therapie</h3>
        <div>
          <ul className="space-y-4">
            <li className="space-y-2">
              <div className="font-bold">
                1 Kennlernenphase - Diagnostik und Zielsetzung
              </div>
              <div>
                In den ersten 4 Gesprächen (Probatorik) werden wir uns
                kennenlernen. Wir betrachten dabei gemeinsam die Einflüsse, die
                Ihre Probleme verursachen und aufrechterhalten. Der Fokus liegt
                dabei auf Denk- und Verhaltensmustern, auf Ihre Lebensumstände
                und auf Ihre Biographie. Zudem werden wir konkrete Therapieziele
                festlegen.
              </div>
            </li>
            <li className="space-y-2">
              <div className="font-bold">
                2 Therapiephase - Prozess der Veränderung
              </div>
              <div>
                Auf Basis der Therapieziele wenden wir uns nun den nötigen
                Schritten zu, um Veränderungen schaffen zu können. Dabei kommen
                verschiedene psychotherapeutische Methoden zum Einsatz, welche
                innerhalb der Therapiesitzung, als auch zwischen den Sitzungen
                umgesetzt werden. Im engen Austausch beleuchten wir, was für Sie
                funktioniert und was nicht.
              </div>
              <div>
                Ich verwende ausschließlich wissenschaftlich fundierte Methoden.
                Neben verhaltenstherapeutischen Techniken, verwende ich Elemente
                aus der Schematherapie und der Akzeptanz- und
                Commitment-Therapie (ACT).
              </div>
            </li>
            <li className="space-y-2">
              <div className="font-bold">3 Abschlussphase - Abschied</div>
              <div>
                Immer mehr schaffen Sie es, die gewünschte Veränderung
                aufrechtzuerhalten und die Erkenntnisse aus der Therapie in
                ihren Alltag zu integrieren. Nun ist es Zeit,die
                Sitzungsfrequenz zu reduzieren und dem Abschied
                entgegenzutreten.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

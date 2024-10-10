import Image from "next/image";

export default function Therapie() {
  return (
    <div className="text-image">
      <div className="image">
        <Image
          src="/filler.png"
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
                kennenlernen. Wir betrachten dabei gemeinsam die Einflüsse, die
                ihre Probleme verursachen und aufrechterhalten. Zudem werden wir
                konkrete Therapieziele festlegen.
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
  );
}

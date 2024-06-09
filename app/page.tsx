import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="grid grid-cols-[repeat(3,auto)_4fr] justify-start p-4 gap-8 sticky top-0 bg-black">
        <Link href="/about-me">Über mich</Link>
        <Link href="/praxis">Praxis</Link>
        <Link href="/kosten">Kosten</Link>
        <Link className="justify-self-end" href="/book">
          Termin buchen
        </Link>
      </div>
      <div className="flex h-[80vh] bg-[url('/raum.jpg')] bg-cover bg-fixed bg-center">
        <div className="m-auto">Psychotherapie am Stadion</div>
      </div>
      <div className="grid grid-flow-col grid-cols-2 gap-x-12 items-center justify-items-center">
        <div>
          <div className="text-2xl pb-2">Philosophie</div>
          <div>
            Psychotherapie bedeutet für mich einen sicheren Raum zu gestalten,
            indem Sie ihre Probleme und Herausforderungen unbefangen anschauen
            können. Dabei ist mir ein gemeinsames Verstehen ihrer Problematik in
            der Ursache, sowie der auslösenden und aufrechterhaltenden Faktoren
            wichtig. Hierzu sollen Gefühle gelebt, Gedanken ausgesprochen und
            Verhalten gezeigt werden können, um Veränderungen anzustoßen und
            neue Denk- und Verhaltensweisen aufbauen zu können. Ich verwende die
            Methode der Verhaltenstherapie und lasse hierzu emotionsfokussierten
            Techniken, sowie schematherapeutische und ACT- basierende Elemente
            einfließen. Generell ist mir jedoch ein individuelles Vorgehen
            wichtig, da der Zugang zu sich selbst von Mensch zu Mensch
            unterschiedlich ist.
          </div>
        </div>
        <div>
          <Image src="/raum.jpg" alt="Raum" width={400} height={400} />
        </div>
      </div>
      <div className="text-center w-full h-[40vw] content-center bg-red-600">
        Über mich
      </div>
    </main>
  );
}

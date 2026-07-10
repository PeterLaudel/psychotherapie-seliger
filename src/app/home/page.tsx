import AboutMe from "./aboutMe";
import Contact from "./_components/contact";
import Costs from "./costs";
import Therapie from "./therapie";
import TreatmentSpectrum from "./treatmentSpectrum";
import Image from "next/image";
import { graph } from "./structuredData";

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
      <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
        <Image
          src="/raum.jpeg"
          alt="Praxisraum der Privatpraxis für Psychotherapie Seliger in Leipzig"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="relative flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-2xl md:text-7xl [text-shadow:1px_1px_1px_rgb(0_0_0/20%)] shrink-on-scroll">
            Privatpraxis für Psychotherapie in Leipzig
          </h1>
          <p className="text-lg md:text-3xl pt-4 [text-shadow:1px_1px_1px_rgb(0_0_0/20%)]">
            Verhaltenstherapie für Erwachsene – Ute Seliger
          </p>
        </div>
      </div>

      <section id="about_me">
        <AboutMe />
      </section>

      <section id="therapie">
        <Therapie />
      </section>

      <section id="behandlungsspektrum">
        <TreatmentSpectrum />
      </section>

      <section id="kosten">
        <Costs />
      </section>

      <section id="kontakt">
        <Contact />
      </section>
    </main>
  );
}

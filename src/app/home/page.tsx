import Script from "next/script";
import AboutMe from "../../components/aboutMe";
import Contact from "../../components/contact";
import Costs from "../../components/costs";
import Therapie from "../../components/therapie";
import TreatmentSpectrum from "../../components/treatmentSpectrum";
import { graph } from "./structuredData";

export default function Home() {
  return (
    <main>
      <Script
        id="jsonld-organization"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
      <div className="flex h-[30vh] md:h-[80vh] bg-[url('/raum.jpeg')] bg-cover bg-center md:bg-fixed text-white">
        <div className="m-auto grid-flow-row">
          <h1 className="text-2xl md:text-7xl [text-shadow:_1px_1px_1px_rgb(0_0_0_/_20%)]">
            Privatpraxis für Psychotherapie
          </h1>
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

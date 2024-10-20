import Contact from "../components/contact";
import AboutMe from "../components/aboutMe";
import Therapie from "../components/therapie";
import TreatmentSpectrum from "../components/treatmentSpectrum";
import Costs from "../components/costs";

export default function Home() {
  return (
    <main>
      <div className="flex h-[30vh] md:h-[80vh] bg-[url('/raum.jpeg')] bg-cover bg-center md:bg-fixed text-white">
        <div className="m-auto grid-flow-row">
          <h1 className="text-2xl md:text-7xl [text-shadow:_1px_1px_1px_rgb(0_0_0_/_20%)]">
            Praxis für Psychotherapie
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

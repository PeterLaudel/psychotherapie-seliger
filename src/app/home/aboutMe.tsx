import Image from "next/image";

export default function AboutMe() {
  return (
    <div className="image-text">
      <div className="image w-full h-auto md:h-full md:w-auto">
        <Image
          src="/person.jpg"
          alt="Foto von Ute Seliger"
          width={0}
          height={0}
          sizes="100%"
          className="w-full h-auto aspect-[3/4] rounded-[50%]"
        />
      </div>
      <div className="text">
        <div className="pb-4">
          <h1>Ute Seliger</h1>
        </div>
        <div>
          <h5 className="pb-4">
            Ich bin Psychologische Psychotherapeutin mit dem Schwerpunkt
            Verhaltenstherapie.
          </h5>
          <div className="pb-4">
            In meiner Privatpraxis für Psychotherapie im Waldstraßenviertel in
            Leipzig möchte ich Ihnen einen sicheren Raum für Ihre Gedanken und
            Gefühle geben. Es ist mir wichtig, dass Sie sich gut aufgehoben und
            als Person mit Ihren Bedürfnissen ernst genommen fühlen.
          </div>
          <div className="pb-4">
            Meine Erfahrungen liegen im stationären als auch im ambulanten
            Bereich:
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
  );
}

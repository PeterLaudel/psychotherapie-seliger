import Image from "next/image";

export default function AboutMe() {
  return (
    <div className="image-text">
      <div className="image">
        <Image
          src="/person.jpg"
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
    </div>
  );
}

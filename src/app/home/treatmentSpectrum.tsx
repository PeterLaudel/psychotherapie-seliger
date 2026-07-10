import Image from "next/image";

export default function TreatmentSpectrum() {
  return (
    <div className="image-text">
      <div className="image w-full max-w-[280px] h-auto md:h-full md:w-[30vw] md:max-w-none justify-self-center">
        <Image
          src="/brain.jpeg"
          alt="Illustration eines Gehirns – Behandlungsspektrum der Psychotherapie-Praxis"
          width={0}
          height={0}
          sizes="(min-width: 768px) 30vw, 280px"
          className="w-full h-auto aspect-[3/4] rounded-[40%] align-center"
        />
      </div>
      <div className="text">
        <h2 className="pb-4">Behandlungsspektrum</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>ADHS/ADS im Erwachsenenalter</li>
          <li>Beziehungs- und Interaktionsstörungen</li>
          <li>
            Lebenskrise (Trauerbewältigung, Trennung, Geburt, Berufsanfang,
            Studienbeginn etc.)
          </li>
          <li>Depression</li>
          <li>Bipolare Störung</li>
          <li>Zwangsstörung</li>
          <li>
            Angststörung: Panik, Agoraphobie, soziale Phobie, generalisierte
            Angststörung
          </li>
          <li>Essstörung (Magersucht, Bulimie, Binge-eating)</li>
        </ul>
      </div>
    </div>
  );
}

import Image from "next/image";

export default function TreatmentSpectrum() {
  return (
    <div className="image-text">
      <div className="image w-full h-auto md:h-full md:w-auto">
        <Image
          src="/brain.jpeg"
          alt="Füllbild was das Behandlungsspektrum darstellt"
          width={0}
          height={0}
          sizes="100%"
          className="w-full h-auto md:h-full md:w-auto md:min-h-[70vh] rounded-[40%]"
        />
      </div>
      <div className="text">
        <h3 className="pb-2 underline">Behandlungsspektrum</h3>
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

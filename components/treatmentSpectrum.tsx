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
          <li>Beziehungs- und Interaktionsstörungen</li>
          <li>Anpassungsstörung</li>
          <li>Depression</li>
          <li>Bipolare Störung</li>
          <li>Zwangsstörung</li>
          <li>Panik und Agoraphobie</li>
          <li>Soziale Phobie</li>
          <li>Generalisierte</li>
          <li>Angststörung</li>
          <li>Somatoforme</li>
          <li>Störungen</li>
          <li>Essstörung</li>
        </ul>
      </div>
    </div>
  );
}

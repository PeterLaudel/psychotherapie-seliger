import Image from "next/image";

export default function TreatmentSpectrum() {
  return (
    <div className="image-text">
      <div className="image">
        <Image
          src="/brain.png"
          alt="Füllbild was das Behandlungsspektrum darstellt"
          width={0}
          height={0}
          sizes="100%"
          className="h-auto max-h-[70vh] w-auto rounded-[40%]"
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

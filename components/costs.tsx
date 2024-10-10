export default function Costs() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="pb-2">Kosten der Therapie</h2>
        <p className="text-lg leading-relaxed">
          Die Abrechnung in meiner Praxis erfolgt gemäß den aktuellen{" "}
          <a
            href="https://api.bptk.de/uploads/Uebersicht_Analogleistungen_gemaess_Abrechnungsempfehlungen_B_Pt_K_B_Ae_K_PKV_Beihilfe_2024_07_01_5d59d963de.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Abrechnungsempfehlungen der Bundespsychotherapeutenkammer fürg
            Privatversicherte und Beihilfeberechtigte (Stand: 01.07.2024)
          </a>
          . Die genauen Kosten hängen von der jeweiligen Therapieleistung ab und
          orientieren sich an den empfohlenen Sätzen. Für weitere Informationen
          stehe ich Ihnen gerne zur Verfügung.
        </p>
      </div>
      <div>
        <h4 className="font-bold mb-4">Therapie möglich für:</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>Privatversicherte</li>
          <li>Beihilfefähige</li>
          <li>Heilfürsorgeberechtigte</li>
          <li>Selbstzahler*innen</li>
        </ul>
      </div>
    </div>
  );
}

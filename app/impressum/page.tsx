import Navbar from "../../components/navbar";

export default function Impressum() {
  return (
    <main>
      <Navbar />
      <div className="grid grid-flow-row md:grid-flow-col md:gap-8 items-center justify-items-center px-4 py-28">
        <div>
          <div className="text-2xl pb-2">Impressum</div>
          <div>
            <div>Angaben gemäß § 5 TMG</div>
            <div>Ute Seliger</div>
            <div>Psychologische Psychotherapeutin</div>
            <div>Waldstraße 31</div>
            <div>04105 Leipzig</div>
            <div>Telefon: 0341 225 40 30</div>
            <div>E-Mail:</div>
          </div>
        </div>
      </div>
    </main>
  );
}

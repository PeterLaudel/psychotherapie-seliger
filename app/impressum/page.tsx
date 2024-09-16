import Navbar from "../../components/navbar";

export default function Impressum() {
  return (
    <main>
      <Navbar />
      <div className="section">
        <div>
          <div>
            <div>
              <h3>
                <strong>Anschrift</strong>
              </h3>
              <p>
                <span>
                  Ute Seliger
                  <br />
                  Praxis für Psychotherapie
                  <br />
                  Friedrich-Ebert-Str. 98
                  <br />
                  04105 Leipzig
                  <br />
                </span>
              </p>
              <h3>
                <strong>
                  <br />
                  Kontakt
                </strong>
              </h3>
              <p>
                <strong>Telefon:</strong>{" "}
                <a href="tel:1234567">
                  <span>1234567</span>
                </a>
                <br />
                <strong>E-Mail:</strong> <a href="mailto:email">email</a>
              </p>
              <h3>
                <strong>
                  <br />
                  Berufsbezeichnung und berufsrechtliche Regelungen
                </strong>
              </h3>
              <p>
                <strong>Berufsbezeichnung:</strong>
                <br />
                psychologischer Psychotherapeut, Verhaltenstherapie
              </p>
              <p>
                <strong>Zuständige Kammer:</strong>
                <br />
                Ostdeutsche Psychotherapeutenkammer
                <br />
                Goyastraße 2d
                <br />
                04105 Leipzig
              </p>
              <p>
                <strong>Verliehen in:</strong>
                <br />
                Deutschland
              </p>
              <h3>
                <strong>
                  <br />
                  Angaben zur Berufshaftpflichtversicherung
                </strong>
              </h3>
              <p>
                <strong>Name und Sitz des Versicherers:</strong>
                <br />
                Barmenia Allgemeine Versicherungs-AG
                <br />
                Barmenia-Allee 1<br />
                42119 Wuppertal
              </p>
              <p>
                <strong>Geltungsraum der Versicherung:</strong>
                <br />
                Deutschland
              </p>
              <h3>
                <strong>
                  <br />
                  Verbraucherstreitbeilegung/Universalschlichtungsstelle
                </strong>
              </h3>
              <p>
                Wir sind nicht bereit oder verpflichtet, an
                Streitbeilegungsverfahren vor einer
                <br />
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

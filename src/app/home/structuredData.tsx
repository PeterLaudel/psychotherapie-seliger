import { Graph } from "schema-dts";

export const graph: Graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.psychotherapie-seliger.de/home",
      name: "Psychotherapie Seliger",
      url: "https://www.psychotherapie-seliger.de/home",
      logo: "https://www.psychotherapie-seliger.de/logo.svg",
      image: "https://www.psychotherapie-seliger.de/person.jpg",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+4915252735959",
        email: "psychotherapie@praxis-seliger.com",
        contactType: "Psychotherapie",
        areaServed: "DE",
        availableLanguage: ["de"],
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Friedrich-Ebert-Straße 19",
        addressLocality: "Leipzig",
        postalCode: "04105",
        addressCountry: "DE",
      },
      sameAs: ["https://www.therapie.de/profil/seliger/"],
    },
    {
      "@type": "AboutPage",
      "@id": "https://www.psychotherapie-seliger.de/home#about_me",
      name: "Über mich",
      url: "https://www.psychotherapie-seliger.de/home#about_me",
      inLanguage: "de",
      description:
        "Informationen über die Psychotherapeutin, ihre Qualifikationen und Erfahrungen.",
      mainEntity: {
        "@id": "https://www.psychotherapie-seliger.de/home",
      },
    },
    {
      "@type": "ContactPage",
      "@id": "https://www.psychotherapie-seliger.de/home#kontakt_formular",
      name: "Kontakt",
      url: "https://www.psychotherapie-seliger.de/home#kontakt_formular",
      inLanguage: "de",
      description: "Kontaktformular für Anfragen und Terminvereinbarungen.",
      mainEntity: {
        "@id": "https://www.psychotherapie-seliger.de/home",
      },
    },
  ],
};

import { Graph } from "schema-dts";

export const graph: Graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalClinic",
      "@id": "https://www.psychotherapie-seliger.de/home",
      name: "Psychotherapie Seliger – Privatpraxis für Psychotherapie",
      url: "https://www.psychotherapie-seliger.de/home",
      logo: "https://www.psychotherapie-seliger.de/logo.svg",
      image: "https://www.psychotherapie-seliger.de/raum.jpeg",
      telephone: "+4915252735959",
      email: "psychotherapie@praxis-seliger.com",
      medicalSpecialty: "https://schema.org/Psychiatric",
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
        streetAddress: "Friedrich-Ebert-Straße 98",
        addressLocality: "Leipzig",
        postalCode: "04105",
        addressCountry: "DE",
      },
      founder: {
        "@id": "https://www.psychotherapie-seliger.de/home#ute-seliger",
      },
      hasMap: "https://maps.google.com/?cid=14392311910153151505",
      sameAs: [
        "https://www.therapie.de/profil/seliger/",
        "https://maps.google.com/?cid=14392311910153151505",
      ],
    },
    {
      "@type": "Person",
      "@id": "https://www.psychotherapie-seliger.de/home#ute-seliger",
      name: "Ute Seliger",
      jobTitle: "Psychologische Psychotherapeutin",
      image: "https://www.psychotherapie-seliger.de/person.jpg",
      worksFor: {
        "@id": "https://www.psychotherapie-seliger.de/home",
      },
      knowsAbout: [
        "Verhaltenstherapie",
        "Schematherapie",
        "Akzeptanz- und Commitment-Therapie",
      ],
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
        "@id": "https://www.psychotherapie-seliger.de/home#ute-seliger",
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

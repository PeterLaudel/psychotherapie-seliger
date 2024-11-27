import IRead from "../interfaces/read.js";
import type { Service } from "../models/service.ts";

const services: Service[] = [
  {
    short: "85 analog",
    originalGopNr: "85",
    description:
      "Erstellung des verfahrensspezifischen Berichts an den Gutachter für die Beantragung einer Psychotherapie mit einem wissenschaftlich anerkannten Psychotherapieverfahren unter Einbeziehung vorliegender Befunde und ggf. Abstimmung mit vor- und mitbehandelnden Ärzten und Psychotherapeuten. Je angefangene Stunde Arbeitszeit.",
    note: "Kann anstelle der bisher üblichen Nr. 808 abgerechnet werden",
    points: 500,
    amounts: {
      "1.0": 29.14,
      "2.3": 67.03,
    },
  },
  {
    short: "801 analog",
    originalGopNr: "801",
    description:
      "Erhebung des aktuellen psychischen Befunds ohne Mindestdauer.",
    note:
      "Kann bei der Psychotherapeutischen Sprechstunde (812 analog) nicht zugesetzt werden",
    points: 250,
    amounts: {
      "1.0": 14.57,
      "2.3": 33.52,
    },
  },
  {
    short: "804 analog",
    originalGopNr: "804",
    description:
      "Psychotherapeutische Behandlung durch eingehendes therapeutisches Gespräch – auch mit gezielter Exploration",
    note: "Ohne Mindestdauer",
    points: 150,
    amounts: {
      "1.0": 8.74,
      "2.3": 20.11,
    },
  },
  {
    short: "807 analog (Kinder/Jugendliche)",
    originalGopNr: "807",
    description:
      "Vertiefte Exploration in Fortführung einer biographischen psychotherapeutischen Anamnese bei Kindern oder Jugendlichen unter Einschaltung der Bezugs- und Kontaktpersonen mit schriftlicher Aufzeichnung, auch in mehreren Sitzungen",
    points: 400,
    amounts: {
      "1.0": 23.31,
      "2.3": 53.62,
    },
  },
  {
    short: "807 analog (Erwachsene)",
    originalGopNr: "807",
    description:
      "Vertiefte Exploration in Fortführung einer biographischen psychotherapeutischen Anamnese bei Erwachsenen unter Einschaltung der Bezugs- und Kontaktpersonen mit schriftlicher Aufzeichnung",
    points: 400,
    amounts: {
      "1.0": 23.31,
      "2.3": 53.62,
    },
  },
  {
    short: "812 analog",
    originalGopNr: "812",
    description:
      "Psychotherapeutische Sprechstunde – Abklärung des Vorliegens einer krankheitswertigen Störung.",
    note:
      "Höchstens sechsmal im Jahr, bei Kindern und Jugendlichen sowie Patienten mit geistiger Behinderung höchstens zehnmal berechnungsfähig.",
    points: 500,
    amounts: {
      "1.0": 29.14,
      "2.3": 67.03,
    },
  },
  {
    short: "812 analog (Akutbehandlung)",
    originalGopNr: "812",
    description:
      "Psychotherapeutische Akutbehandlung zur Entlastung bei akuten psychischen Krisen- und Ausnahmezuständen. Behandlungsbeginn nach Indikationsstellung innerhalb von zwei Wochen.",
    note:
      "Bis zu zweimal an einem Kalendertag und bis zu vierundzwanzigmal im Jahr berechnungsfähig.",
    points: 500,
    amounts: {
      "1.0": 29.14,
      "2.3": 67.03,
    },
  },
  {
    short: "812 analog (Kurzzeittherapie)",
    originalGopNr: "812",
    description:
      "Psychotherapeutische Kurzzeittherapie – symptom- und/oder konfliktbezogene Behandlung mittels geeigneter psychotherapeutischer Interventionen.",
    note:
      "Bis zu zweimal an einem Kalendertag und bis zu achtundvierzigmal im Jahr berechnungsfähig.",
    points: 500,
    amounts: {
      "1.0": 29.14,
      "2.3": 67.03,
    },
  },
  {
    short: "812 analog (Gruppentherapie)",
    originalGopNr: "812",
    description:
      "Gruppenpsychotherapeutische Kurzzeittherapie mit mindestens 2 bis 9 Teilnehmern.",
    note:
      "Bis zu zweimal an einem Kalendertag und bis zu achtundvierzigmal im Jahr berechnungsfähig.",
    points: 500,
    amounts: {
      "1.0": 29.14,
      "2.3": 67.03,
    },
  },
  {
    short: "817 analog (Kinder/Jugendliche)",
    originalGopNr: "817",
    description:
      "Eingehende psychotherapeutische Beratung der Bezugsperson von Kindern oder Jugendlichen anhand erhobener Befunde und Erläuterung geplanter therapeutischer Maßnahmen.",
    points: 180,
    amounts: {
      "1.0": 10.49,
      "2.3": 24.13,
    },
  },
  {
    short: "817 analog (Erwachsene)",
    originalGopNr: "817",
    description:
      "Eingehende psychotherapeutische Beratung der Bezugsperson von Erwachsenen anhand erhobener Befunde und Erläuterung geplanter therapeutischer Maßnahmen.",
    points: 180,
    amounts: {
      "1.0": 10.49,
      "2.3": 24.13,
    },
  },
  {
    short: "855 analog (Testbatterie)",
    originalGopNr: "855",
    description:
      "Durchführung, Auswertung und Besprechung einer psychologischen – auch neuropsychologischen – Testbatterie zum umfassenden Assessment (mindestens 3 Testverfahren, z.B. PHQ-D, BDI, PSSI, ISR, HAQ).",
    points: 722,
    amounts: {
      "1.0": 42.08,
      "1.8": 75.75,
    },
  },
  {
    short: "855 analog (Klinisch-diagnostisches Interview)",
    originalGopNr: "855",
    description:
      "Anwendung eines validierten, standardisierten, strukturierten klinisch-diagnostischen Interviews (z.B. SIAB-EX, Module des SCID-5-CV, PANSS-Interview) mit schriftlicher Aufzeichnung.",
    points: 722,
    amounts: {
      "1.0": 42.08,
      "1.8": 75.75,
    },
  },
  {
    short: "860 analog",
    originalGopNr: "860",
    description:
      "Erhebung einer biographischen Anamnese mit schriftlicher Aufzeichnung zur Einleitung und Indikationsstellung eines wissenschaftlich anerkannten Psychotherapieverfahrens.",
    points: 920,
    amounts: {
      "1.0": 53.62,
      "2.3": 123.34,
    },
  },
  {
    short: "870 analog",
    originalGopNr: "870",
    description:
      "Systemische Therapie sowie Neuropsychologische Psychotherapie oder EMDR als psychotherapeutische Methode in den Anwendungsbereichen der Psychotherapie.",
    note: "Einzelbehandlung, Dauer mindestens 50 Minuten.",
    points: 750,
    amounts: {
      "1.0": 43.72,
      "2.3": 100.55,
    },
  },
];

export class ServicesRepository implements IRead<Service> {
  constructor() {}

  async get(): Promise<Service[]> {
    return services;
  }
}

import type { Locale } from "@/i18n/routing";
import { pick, type Localized } from "@/lib/locale";

export type SecurityPrinciple = {
  slug: string;
  title: Localized;
  text: Localized;
  paragraphs: Localized<string[]>;
};

export const securityPrinciples: SecurityPrinciple[] = [
  {
    slug: "norwegian-owned",
    title: { en: "100% Norwegian", no: "100 % norsk" },
    text: {
      en: "Norwegian-owned and operated. All business activity takes place in Norway with no foreign ownership interests.",
      no: "Norsk eid og drevet. All forretningsvirksomhet skjer i Norge uten utenlandske eierinteresser.",
    },
    paragraphs: {
      en: [
        "Ownership, management, and operations stay in Norway so accountability and legal jurisdiction remain clear. Where formal security rules apply, obligations are handled through contract and customer approval.",
      ],
      no: [
        "Eierskap, ledelse og drift forblir i Norge, slik at ansvar og jurisdiksjon er tydelig. Der formelle sikkerhetskrav gjelder, håndteres forpliktelser gjennom kontrakt og kundegodkjenning.",
      ],
    },
  },
  {
    slug: "own-infrastructure",
    title: { en: "Own infrastructure", no: "Egen infrastruktur" },
    text: {
      en: "All software development and data processing runs exclusively on our own controlled systems hosted on Norwegian infrastructure.",
      no: "All programvareutvikling og databehandling kjører utelukkende på våre egne kontrollerte systemer hostet på norsk infrastruktur.",
    },
    paragraphs: {
      en: [
        "Software development and data processing run on Spectr-controlled systems on Norwegian infrastructure. Access, logging, and security requirements are defined before sensitive work begins.",
      ],
      no: [
        "Programvareutvikling og databehandling kjører på Spectr-kontrollerte systemer på norsk infrastruktur. Tilgang, logging og sikkerhetskrav defineres før sensitivt arbeid starter.",
      ],
    },
  },
  {
    slug: "no-third-parties",
    title: { en: "No third parties", no: "Ingen tredjeparter" },
    text: {
      en: "We use no external vendors in our software supply chain. No data is shared with or processed by third parties.",
      no: "Vi bruker ingen eksterne leverandører i programvareleveransekjeden. Ingen data deles med eller behandles av tredjeparter.",
    },
    paragraphs: {
      en: [
        "Sensitive software development does not rely on unnecessary external vendors. Customer data is not shared with third parties unless a documented, customer-approved exception applies.",
      ],
      no: [
        "Sensitiv programvareutvikling avhenger ikke av unødvendige eksterne leverandører. Kundedata deles ikke med tredjeparter med mindre et dokumentert, kundegodkjent unntak gjelder.",
      ],
    },
  },
  {
    slug: "full-control",
    title: { en: "Full control", no: "Full kontroll" },
    text: {
      en: "100% internal control over every process, from development to final delivery. No exceptions.",
      no: "100 % intern kontroll over hver prosess, fra utvikling til endelig leveranse. Ingen unntak.",
    },
    paragraphs: {
      en: [
        "Spectr keeps direct responsibility from development through delivery and support. Decisions are traceable, changes deliberate, and sensitive work follows controlled processes.",
      ],
      no: [
        "Spectr beholder direkte ansvar fra utvikling til leveranse og støtte. Beslutninger er sporbare, endringer bevisste, og sensitivt arbeid følger kontrollerte prosesser.",
      ],
    },
  },
  {
    slug: "confidentiality",
    title: { en: "Confidentiality", no: "Konfidensialitet" },
    text: {
      en: "We operate under strict confidentiality requirements and handle sensitive information with the highest level of care.",
      no: "Vi opererer under strenge konfidensialitetskrav og håndterer sensitiv informasjon med høyeste grad av omhu.",
    },
    paragraphs: {
      en: [
        "Operational and customer information is handled as sensitive by default. Access is need-to-know, and stricter handling applies where classified or project-specific rules require it.",
      ],
      no: [
        "Operasjonell og kundeinformasjon behandles som sensitiv som standard. Tilgang er need-to-know, og strengere håndtering gjelder der klassifiserte eller prosjektspesifikke regler krever det.",
      ],
    },
  },
  {
    slug: "norwegian-law",
    title: { en: "Norwegian law", no: "Norsk lov" },
    text: {
      en: "We operate in full compliance with Norwegian law, the Security Act, GDPR, and national information security requirements.",
      no: "Vi opererer i full overensstemmelse med norsk lov, sikkerhetsloven, GDPR og nasjonale informasjonssikkerhetskrav.",
    },
    paragraphs: {
      en: [
        "We comply with Norwegian law, the Security Act, and GDPR. Security agreements, classification, and access controls are defined before regulated work starts.",
      ],
      no: [
        "Vi følger norsk lov, sikkerhetsloven og GDPR. Sikkerhetsavtaler, klassifisering og tilgangskontroller defineres før regulert arbeid starter.",
      ],
    },
  },
];

export function getSecurityPrinciple(slug: string) {
  return securityPrinciples.find((principle) => principle.slug === slug);
}

export function pickSecurityField<T>(value: Localized<T>, locale: Locale): T {
  return pick(value, locale);
}

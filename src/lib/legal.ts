import type { Locale } from "@/i18n/routing";
import { pick, type Localized } from "@/lib/locale";

export type LegalSection = {
  title: Localized;
  text: Localized;
  hasContactLink?: boolean;
};

export const privacySections: LegalSection[] = [
  {
    title: { en: "Information we collect", no: "Informasjon vi samler inn" },
    text: {
      en: "When you contact Spectr, request information, apply for careers, or engage with our website, we may collect details such as your name, email address, phone number, organization, role, country, product interest, procurement context, and message content.",
      no: "Når du kontakter Spectr, ber om informasjon, søker stillinger eller bruker nettstedet vårt, kan vi samle inn opplysninger som navn, e-post, telefonnummer, organisasjon, rolle, land, produktinteresse, innkjøpskontekst og meldingsinnhold.",
    },
  },
  {
    title: { en: "How we use information", no: "Hvordan vi bruker informasjon" },
    text: {
      en: "We use submitted information to respond to inquiries, coordinate product or documentation requests, evaluate operational fit, perform security and qualification review, support recruitment, and maintain business records.",
      no: "Vi bruker innsendt informasjon til å svare på henvendelser, koordinere produkt- eller dokumentasjonsforespørsler, vurdere operasjonell egnethet, gjennomføre sikkerhets- og kvalifiseringsgjennomgang, støtte rekruttering og opprettholde forretningslogger.",
    },
  },
  {
    title: { en: "Defense and military inquiries", no: "Forsvars- og militære henvendelser" },
    text: {
      en: "Spectr operates in a sensitive sector. We may review inquiries from government, defense, security, and qualified commercial operators before responding. We may decline engagement where legal, export-control, sanctions, or national-security concerns arise.",
      no: "Spectr opererer i en sensitiv sektor. Vi kan gjennomgå henvendelser fra myndigheter, forsvar, sikkerhet og kvalifiserte kommersielle operatører før vi svarer. Vi kan avslå engasjement der juridiske, eksportkontroll-, sanksjons- eller nasjonal sikkerhetshensyn oppstår.",
    },
  },
  {
    title: { en: "Cookies and website data", no: "Informasjonskapsler og nettstedsdata" },
    text: {
      en: "We use essential cookies to operate the website and remember cookie preferences. Additional analytics or marketing cookies, if introduced, will be subject to consent where required by law.",
      no: "Vi bruker nødvendige informasjonskapsler for å drive nettstedet og huske samtykkevalg. Eventuelle tilleggsinformasjonskapsler for analyse eller markedsføring vil være underlagt samtykke der loven krever det.",
    },
  },
  {
    title: { en: "Security", no: "Sikkerhet" },
    text: {
      en: "We use reasonable technical and organizational measures to protect information. Defense-related inquiries should not include classified information or restricted operational material through the public contact form.",
      no: "Vi bruker rimelige tekniske og organisatoriske tiltak for å beskytte informasjon. Forsvarsrelaterte henvendelser bør ikke inneholde klassifisert informasjon eller begrenset operasjonelt materiale via det offentlige kontaktskjemaet.",
    },
  },
  {
    title: { en: "Your rights", no: "Dine rettigheter" },
    text: {
      en: "Depending on your location, you may have rights to access, correct, delete, restrict, or object to certain processing of your personal information, subject to legal and compliance limitations.",
      no: "Avhengig av hvor du befinner deg, kan du ha rett til innsyn, retting, sletting, begrensning eller innsigelse mot visse former for behandling, med forbehold om juridiske og etterlevelsesmessige begrensninger.",
    },
  },
  {
    title: { en: "Contact", no: "Kontakt" },
    text: {
      en: "For privacy questions or requests, contact Spectr through the contact page with Privacy Request in the message.",
      no: "For personvernspørsmål eller forespørsler, kontakt Spectr via kontaktsiden med Privacy Request i meldingen.",
    },
    hasContactLink: true,
  },
];

export const termsSections: LegalSection[] = [
  {
    title: { en: "Use of the website", no: "Bruk av nettstedet" },
    text: {
      en: "This website provides general information about Spectr, its products, and operating principles. Content does not constitute an offer, warranty, or binding commitment unless confirmed in writing.",
      no: "Dette nettstedet gir generell informasjon om Spectr, produktene og driftsprinsippene. Innhold utgjør ikke et tilbud, garanti eller bindende forpliktelse med mindre det bekreftes skriftlig.",
    },
  },
  {
    title: { en: "Product information", no: "Produktinformasjon" },
    text: {
      en: "Specifications, availability, and capabilities described on this site are subject to configuration, qualification, and contractual terms. Operational use may require approvals, training, and customer-specific agreements.",
      no: "Spesifikasjoner, tilgjengelighet og kapabiliteter beskrevet på dette nettstedet er underlagt konfigurasjon, kvalifisering og kontraktsvilkår. Operasjonell bruk kan kreve godkjenninger, opplæring og kundespesifikke avtaler.",
    },
  },
  {
    title: { en: "Intellectual property", no: "Immaterielle rettigheter" },
    text: {
      en: "All content, trademarks, product names, visuals, and documentation on this website are owned by or licensed to Spectr unless otherwise stated.",
      no: "Alt innhold, varemerker, produktnavn, visuelle elementer og dokumentasjon på dette nettstedet eies av eller er lisensiert til Spectr med mindre annet er oppgitt.",
    },
  },
  {
    title: { en: "Export control and end use", no: "Eksportkontroll og sluttbruk" },
    text: {
      en: "Spectr products and information may be subject to export-control, sanctions, and end-use restrictions. Customers are responsible for obtaining required authorizations.",
      no: "Spectr-produkter og informasjon kan være underlagt eksportkontroll, sanksjoner og sluttbruksbegrensninger. Kunder er ansvarlige for å innhente nødvendige autorisasjoner.",
    },
  },
  {
    title: { en: "Limitation of liability", no: "Ansvarsbegrensning" },
    text: {
      en: "Spectr is not liable for damages arising from use of this website or reliance on general marketing content. Liability for products and services is governed by applicable contracts.",
      no: "Spectr er ikke ansvarlig for skader som oppstår ved bruk av dette nettstedet eller tillit til generelt markedsføringsinnhold. Ansvar for produkter og tjenester reguleres av gjeldende avtaler.",
    },
  },
  {
    title: { en: "Governing law", no: "Gjeldende lov" },
    text: {
      en: "These terms are governed by Norwegian law. Disputes shall be subject to Norwegian courts unless mandatory law provides otherwise.",
      no: "Disse vilkårene er underlagt norsk lov. Tvister skal behandles av norske domstoler med mindre ufravikelig lov gir annet.",
    },
  },
];

export function pickLegalField<T>(value: Localized<T>, locale: Locale): T {
  return pick(value, locale);
}

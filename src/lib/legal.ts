import type { Locale } from "@/i18n/routing";
import { pick, type Localized } from "@/lib/locale";

export type LegalSection = {
  title: Localized;
  text: Localized;
  bullets?: Localized<string[]>;
  hasContactLink?: boolean;
};

export const privacySections: LegalSection[] = [
  {
    title: { en: "1. Introduction", no: "1. Innledning" },
    text: {
      en: "Spectr ('Company', 'we', 'our', or 'us') respects your privacy and is committed to protecting personal data in accordance with the EU General Data Protection Regulation (GDPR), the Norwegian Personal Data Act (personopplysningsloven), and applicable EU ePrivacy requirements. This Privacy Policy explains how we collect, use, store, disclose, and protect personal information when you visit our website or interact with our services.",
      no: "Spectr ('Selskapet', 'vi', 'oss' eller 'vår') respekterer ditt personvern og er forpliktet til å beskytte personopplysninger i samsvar med EUs personvernforordning (GDPR), den norske personopplysningsloven og gjeldende ePrivacy-krav i EU. Denne personvernerklæringen forklarer hvordan vi samler inn, bruker, lagrer, utleverer og beskytter personopplysninger når du besøker nettstedet vårt eller bruker tjenestene våre.",
    },
  },
  {
    title: { en: "2. Data controller", no: "2. Behandlingsansvarlig" },
    text: {
      en: "The data controller responsible for your personal data is spectr as, organization number 936 961 967, Norway. For privacy matters you can reach us by email at makwan@spectr.no or by phone at +47 465 03 934.",
      no: "Behandlingsansvarlig for dine personopplysninger er spectr as, organisasjonsnummer 936 961 967, Norge. For personvernspørsmål kan du kontakte oss på e-post makwan@spectr.no eller telefon +47 465 03 934.",
    },
  },
  {
    title: { en: "3. Information we collect", no: "3. Informasjon vi samler inn" },
    text: {
      en: "We collect information you provide directly and information collected automatically when you use our website.",
      no: "Vi samler inn informasjon du oppgir direkte, og informasjon som samles inn automatisk når du bruker nettstedet vårt.",
    },
    bullets: {
      en: [
        "Information you provide: name, email address, telephone number, company name, job title, messages submitted through contact forms, recruitment and employment information, and newsletter subscription details.",
        "Automatically collected information: IP address, browser type, operating system, device information, referral URLs, website usage data, and security logs.",
      ],
      no: [
        "Informasjon du oppgir: navn, e-postadresse, telefonnummer, firmanavn, stillingstittel, meldinger sendt via kontaktskjema, rekrutterings- og ansettelsesinformasjon og opplysninger om nyhetsbrevabonnement.",
        "Automatisk innsamlet informasjon: IP-adresse, nettlesertype, operativsystem, enhetsinformasjon, henvisnings-URL-er, bruksdata og sikkerhetslogger.",
      ],
    },
  },
  {
    title: { en: "4. Legal basis for processing", no: "4. Behandlingsgrunnlag" },
    text: {
      en: "We process personal data on the following lawful bases under the GDPR:",
      no: "Vi behandler personopplysninger på følgende rettslige grunnlag etter GDPR:",
    },
    bullets: {
      en: [
        "Consent — Article 6(1)(a).",
        "Performance of a contract — Article 6(1)(b).",
        "Compliance with a legal obligation — Article 6(1)(c).",
        "Legitimate interests — Article 6(1)(f).",
      ],
      no: [
        "Samtykke — artikkel 6(1)(a).",
        "Oppfyllelse av en avtale — artikkel 6(1)(b).",
        "Overholdelse av en rettslig forpliktelse — artikkel 6(1)(c).",
        "Berettigede interesser — artikkel 6(1)(f).",
      ],
    },
  },
  {
    title: { en: "5. Purposes of processing", no: "5. Formål med behandlingen" },
    text: {
      en: "We process personal data to respond to inquiries, provide requested information, manage recruitment activities, improve website performance, maintain cybersecurity, prevent fraud and unauthorized access, comply with legal and regulatory obligations, and support our business operations.",
      no: "Vi behandler personopplysninger for å svare på henvendelser, gi forespurt informasjon, håndtere rekruttering, forbedre nettstedets ytelse, opprettholde cybersikkerhet, forhindre svindel og uautorisert tilgang, overholde juridiske og regulatoriske forpliktelser og støtte forretningsdriften.",
    },
  },
  {
    title: { en: "6. Defense industry compliance", no: "6. Etterlevelse i forsvarsindustrien" },
    text: {
      en: "Spectr operates in a sensitive sector. Certain communications, inquiries, or transactions may be subject to Norwegian export control regulations, EU sanctions regulations, international trade compliance requirements, and national security restrictions. We may collect and process information necessary to meet these obligations, may review inquiries before responding, and may decline engagement where legal, export-control, sanctions, or national-security concerns arise.",
      no: "Spectr opererer i en sensitiv sektor. Enkelte henvendelser, forespørsler eller transaksjoner kan være underlagt norsk eksportkontroll, EUs sanksjonsregelverk, internasjonale handelskrav og nasjonale sikkerhetsbegrensninger. Vi kan samle inn og behandle informasjon som er nødvendig for å oppfylle disse forpliktelsene, gjennomgå henvendelser før vi svarer, og avslå engasjement der juridiske, eksportkontroll-, sanksjons- eller nasjonale sikkerhetshensyn oppstår.",
    },
  },
  {
    title: { en: "7. Cookies and analytics", no: "7. Informasjonskapsler og analyse" },
    text: {
      en: "Our website uses cookies and similar technologies for essential website functionality, security, analytics, performance monitoring, and user preferences. Non-essential cookies are only activated after obtaining valid consent where required by law. Please see our Cookie Policy below for full details.",
      no: "Nettstedet vårt bruker informasjonskapsler og lignende teknologier for nødvendig funksjonalitet, sikkerhet, analyse, ytelsesovervåkning og brukerpreferanser. Ikke-nødvendige informasjonskapsler aktiveres kun etter gyldig samtykke der loven krever det. Se vår erklæring om informasjonskapsler nedenfor for full informasjon.",
    },
  },
  {
    title: { en: "8. Data sharing", no: "8. Deling av data" },
    text: {
      en: "We may share personal data with hosting providers, IT service providers, recruitment platforms, analytics providers, legal and compliance advisors, and government authorities where legally required. We do not sell personal information.",
      no: "Vi kan dele personopplysninger med hostingleverandører, IT-leverandører, rekrutteringsplattformer, analyseleverandører, juridiske og etterlevelsesrådgivere og offentlige myndigheter der loven krever det. Vi selger ikke personopplysninger.",
    },
  },
  {
    title: { en: "9. International transfers", no: "9. Internasjonale overføringer" },
    text: {
      en: "Where personal data is transferred outside the European Economic Area (EEA), we implement appropriate safeguards including Standard Contractual Clauses, adequacy decisions, and other legally recognized safeguards.",
      no: "Når personopplysninger overføres utenfor Det europeiske økonomiske samarbeidsområdet (EØS), iverksetter vi egnede sikkerhetstiltak, herunder EUs standardavtaler (Standard Contractual Clauses), tilstrekkelighetsbeslutninger og andre juridisk anerkjente garantier.",
    },
  },
  {
    title: { en: "10. Data retention", no: "10. Lagringstid" },
    text: {
      en: "We retain personal data only for as long as necessary. Typical retention periods are: contact inquiries — 24 months; recruitment applications — 12 months unless consent is obtained for longer; security logs — 12 months; analytics data — 26 months; legal records — as required by law.",
      no: "Vi oppbevarer personopplysninger kun så lenge det er nødvendig. Typiske lagringstider er: kontakthenvendelser — 24 måneder; jobbsøknader — 12 måneder med mindre samtykke gis for lengre tid; sikkerhetslogger — 12 måneder; analysedata — 26 måneder; juridiske dokumenter — så lenge loven krever det.",
    },
  },
  {
    title: { en: "11. Security", no: "11. Sikkerhet" },
    text: {
      en: "We maintain technical and organizational safeguards including encryption, access controls, security monitoring, vulnerability management, and incident response procedures. No system can be guaranteed to be completely secure. Defense-related inquiries should not include classified information or restricted operational material through the public contact form.",
      no: "Vi opprettholder tekniske og organisatoriske tiltak, herunder kryptering, tilgangskontroll, sikkerhetsovervåkning, sårbarhetshåndtering og rutiner for hendelseshåndtering. Ingen system kan garanteres å være fullstendig sikkert. Forsvarsrelaterte henvendelser bør ikke inneholde klassifisert informasjon eller begrenset operasjonelt materiale via det offentlige kontaktskjemaet.",
    },
  },
  {
    title: { en: "12. Your rights", no: "12. Dine rettigheter" },
    text: {
      en: "Under the GDPR you may access your data, correct inaccurate data, request deletion, restrict processing, object to processing, withdraw consent, and request portability, subject to legal and compliance limitations. Requests may be sent to makwan@spectr.no.",
      no: "Etter GDPR kan du be om innsyn i dine data, rette uriktige data, be om sletting, begrense behandling, protestere mot behandling, trekke tilbake samtykke og be om dataportabilitet, med forbehold om juridiske og etterlevelsesmessige begrensninger. Forespørsler kan sendes til makwan@spectr.no.",
    },
  },
  {
    title: { en: "13. Complaints", no: "13. Klager" },
    text: {
      en: "You have the right to lodge a complaint with the Norwegian Data Protection Authority (Datatilsynet).",
      no: "Du har rett til å klage til Datatilsynet (den norske personvernmyndigheten).",
    },
  },
  {
    title: { en: "14. Changes", no: "14. Endringer" },
    text: {
      en: "We may update this Privacy Policy periodically. Updated versions will be posted on this page.",
      no: "Vi kan oppdatere denne personvernerklæringen fra tid til annen. Oppdaterte versjoner publiseres på denne siden.",
    },
  },
  {
    title: { en: "Contact", no: "Kontakt" },
    text: {
      en: "For privacy questions or requests, contact Spectr through the contact page with 'Privacy Request' in the message, or email makwan@spectr.no.",
      no: "For personvernspørsmål eller forespørsler, kontakt Spectr via kontaktsiden med 'Privacy Request' i meldingen, eller send e-post til makwan@spectr.no.",
    },
    hasContactLink: true,
  },
];

export const termsSections: LegalSection[] = [
  {
    title: { en: "1. Acceptance", no: "1. Aksept" },
    text: {
      en: "By accessing this website, you agree to these Terms of Service. If you do not agree, you should not use the website.",
      no: "Ved å bruke dette nettstedet samtykker du til disse vilkårene. Hvis du ikke samtykker, bør du ikke bruke nettstedet.",
    },
  },
  {
    title: { en: "2. Purpose", no: "2. Formål" },
    text: {
      en: "This website provides information regarding defense technologies, autonomous defense software, mission systems, research, and related activities conducted by spectr as.",
      no: "Dette nettstedet gir informasjon om forsvarsteknologi, autonom forsvarsprogramvare, oppdragssystemer, forskning og relatert virksomhet utført av spectr as.",
    },
  },
  {
    title: { en: "3. No offer", no: "3. Ikke et tilbud" },
    text: {
      en: "Information on this website does not constitute a binding offer, legal advice, technical advice, government authorization, or export authorization.",
      no: "Informasjon på dette nettstedet utgjør ikke et bindende tilbud, juridisk rådgivning, teknisk rådgivning, myndighetsgodkjenning eller eksportautorisasjon.",
    },
  },
  {
    title: { en: "4. Export control", no: "4. Eksportkontroll" },
    text: {
      en: "Certain products, software, technologies, documentation, or information may be subject to Norwegian export controls, EU export control regulations, and international sanctions laws. Users are responsible for complying with all applicable laws before accessing, exporting, re-exporting, transferring, or using any materials.",
      no: "Enkelte produkter, programvare, teknologier, dokumentasjon eller informasjon kan være underlagt norsk eksportkontroll, EUs eksportkontrollregelverk og internasjonale sanksjonslover. Brukere er ansvarlige for å overholde alle gjeldende lover før de får tilgang til, eksporterer, re-eksporterer, overfører eller bruker materiale.",
    },
  },
  {
    title: { en: "5. Intellectual property", no: "5. Immaterielle rettigheter" },
    text: {
      en: "All content — including logos, text, software, images, technical documentation, and product descriptions — is owned by or licensed to spectr as. No content may be copied, modified, distributed, reverse engineered, or commercially exploited without written permission.",
      no: "Alt innhold — herunder logoer, tekst, programvare, bilder, teknisk dokumentasjon og produktbeskrivelser — eies av eller er lisensiert til spectr as. Innhold kan ikke kopieres, endres, distribueres, dekompileres eller utnyttes kommersielt uten skriftlig tillatelse.",
    },
  },
  {
    title: { en: "6. Acceptable use", no: "6. Akseptabel bruk" },
    text: {
      en: "You agree not to attempt unauthorized access, conduct security testing without authorization, distribute malware, interfere with website operations, or use the website unlawfully.",
      no: "Du samtykker til å ikke forsøke uautorisert tilgang, utføre sikkerhetstesting uten tillatelse, distribuere skadevare, forstyrre nettstedets drift eller bruke nettstedet ulovlig.",
    },
  },
  {
    title: { en: "7. Third-party links", no: "7. Tredjepartslenker" },
    text: {
      en: "Third-party websites are provided for convenience only. We do not control or endorse third-party content.",
      no: "Tredjeparts nettsteder tilbys kun for enkelhets skyld. Vi kontrollerer eller godkjenner ikke tredjepartsinnhold.",
    },
  },
  {
    title: { en: "8. Disclaimer", no: "8. Ansvarsfraskrivelse" },
    text: {
      en: "Website content is provided 'AS IS' and 'AS AVAILABLE' without warranties of any kind.",
      no: "Innholdet på nettstedet leveres 'SOM DET ER' og 'SLIK DET ER TILGJENGELIG' uten garantier av noe slag.",
    },
  },
  {
    title: { en: "9. Limitation of liability", no: "9. Ansvarsbegrensning" },
    text: {
      en: "To the fullest extent permitted by law, spectr as shall not be liable for indirect damages, consequential damages, lost profits, loss of data, or business interruption arising from use of the website.",
      no: "I den grad loven tillater det, er spectr as ikke ansvarlig for indirekte skader, følgeskader, tapt fortjeneste, tap av data eller driftsavbrudd som oppstår ved bruk av nettstedet.",
    },
  },
  {
    title: { en: "10. Indemnification", no: "10. Skadesløsholdelse" },
    text: {
      en: "Users agree to indemnify and hold harmless spectr as from claims arising from violations of these Terms.",
      no: "Brukere samtykker til å holde spectr as skadesløs fra krav som oppstår som følge av brudd på disse vilkårene.",
    },
  },
  {
    title: { en: "11. Security monitoring", no: "11. Sikkerhetsovervåkning" },
    text: {
      en: "We reserve the right to monitor website activity for security purposes, fraud prevention, regulatory compliance, and protection of intellectual property.",
      no: "Vi forbeholder oss retten til å overvåke aktivitet på nettstedet av hensyn til sikkerhet, svindelforebygging, regulatorisk etterlevelse og beskyttelse av immaterielle rettigheter.",
    },
  },
  {
    title: { en: "12. Governing law", no: "12. Gjeldende lov" },
    text: {
      en: "These Terms are governed by the laws of Norway.",
      no: "Disse vilkårene er underlagt norsk lov.",
    },
  },
  {
    title: { en: "13. Jurisdiction", no: "13. Verneting" },
    text: {
      en: "Any dispute shall be subject to the exclusive jurisdiction of the courts of Norway, unless mandatory law provides otherwise.",
      no: "Enhver tvist skal være underlagt norske domstolers eksklusive jurisdiksjon, med mindre ufravikelig lov bestemmer noe annet.",
    },
  },
];

export const cookieSections: LegalSection[] = [
  {
    title: { en: "What are cookies?", no: "Hva er informasjonskapsler?" },
    text: {
      en: "Cookies are small text files stored on your device when you visit our website. We use them, along with similar technologies, to operate the website and to understand how it is used.",
      no: "Informasjonskapsler er små tekstfiler som lagres på enheten din når du besøker nettstedet vårt. Vi bruker dem, sammen med lignende teknologier, for å drive nettstedet og forstå hvordan det brukes.",
    },
  },
  {
    title: { en: "Strictly necessary cookies", no: "Strengt nødvendige informasjonskapsler" },
    text: {
      en: "Required for website security, session management, authentication, and load balancing. These cookies cannot be disabled.",
      no: "Nødvendige for sikkerhet, øktstyring, autentisering og lastbalansering. Disse informasjonskapslene kan ikke deaktiveres.",
    },
  },
  {
    title: { en: "Analytics cookies", no: "Analyse-informasjonskapsler" },
    text: {
      en: "Used to understand website traffic, user behavior, and performance metrics. Activated only after consent where legally required.",
      no: "Brukes til å forstå trafikk, brukeratferd og ytelsesmålinger. Aktiveres kun etter samtykke der loven krever det.",
    },
  },
  {
    title: { en: "Preference cookies", no: "Preferanse-informasjonskapsler" },
    text: {
      en: "Store user settings such as language and cookie preferences.",
      no: "Lagrer brukerinnstillinger som språk og samtykkevalg for informasjonskapsler.",
    },
  },
  {
    title: { en: "Marketing cookies", no: "Markedsførings-informasjonskapsler" },
    text: {
      en: "Used only where specifically enabled and consented to.",
      no: "Brukes kun der dette er spesifikt aktivert og samtykket til.",
    },
  },
  {
    title: { en: "Cookie consent", no: "Samtykke til informasjonskapsler" },
    text: {
      en: "Upon your first visit you may accept all cookies, reject non-essential cookies, or customize your preferences. Your choices can be changed at any time.",
      no: "Ved første besøk kan du godta alle informasjonskapsler, avvise ikke-nødvendige informasjonskapsler eller tilpasse valgene dine. Valgene kan endres når som helst.",
    },
  },
  {
    title: { en: "Cookie retention", no: "Lagringstid for informasjonskapsler" },
    text: {
      en: "Cookies remain active only for their intended duration and are automatically removed or expire according to their settings.",
      no: "Informasjonskapsler er aktive kun i den tiltenkte varigheten og fjernes automatisk eller utløper i henhold til innstillingene.",
    },
  },
  {
    title: { en: "Cookie contact", no: "Kontakt om informasjonskapsler" },
    text: {
      en: "Questions regarding cookies or privacy can be sent to makwan@spectr.no.",
      no: "Spørsmål om informasjonskapsler eller personvern kan sendes til makwan@spectr.no.",
    },
    hasContactLink: true,
  },
];

export function pickLegalField<T>(value: Localized<T>, locale: Locale): T {
  return pick(value, locale);
}

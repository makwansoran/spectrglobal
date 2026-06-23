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
        "Spectr is Norwegian-owned, Norwegian-operated, and accountable from Norway. Ownership, management, product decisions, and operational responsibility are kept inside the Norwegian jurisdiction so customers know where control sits and which legal framework governs the company.",
        "For security, military, logistics, and critical-infrastructure customers, ownership is not only a corporate detail. It affects influence, supply-chain exposure, decision authority, and the ability to maintain long-term national control over sensitive technology. Our position is that critical technology should be developed and controlled locally unless a project-specific agreement says otherwise.",
        "This page is a public statement of our operating model. Where a customer project is subject to formal security requirements, classified procurement rules, export controls, or other legal obligations, those obligations must be handled through the correct contract, security agreement, authorisations, and customer-side approval process.",
      ],
      no: [
        "Spectr er norsk eid, norsk drevet og ansvarlig fra Norge. Eierskap, ledelse, produktbeslutninger og operasjonelt ansvar holdes innenfor norsk jurisdiksjon, slik at kunder vet hvor kontrollen ligger og hvilket rettslig rammeverk som gjelder selskapet.",
        "For sikkerhets-, forsvars-, logistikk- og kritisk-infrastrukturkunder er eierskap ikke bare et selskapsdetalj. Det påvirker innflytelse, leverandørkjedeksponering, beslutningsmyndighet og evnen til å opprettholde langsiktig nasjonal kontroll over sensitiv teknologi. Vår posisjon er at kritisk teknologi bør utvikles og kontrolleres lokalt med mindre en prosjektspesifikk avtale sier noe annet.",
        "Denne siden er en offentlig erklæring om vår driftsmodell. Der et kundeprosjekt er underlagt formelle sikkerhetskrav, klassifiserte innkjøpsregler, eksportkontroll eller andre juridiske forpliktelser, må disse håndteres gjennom riktig kontrakt, sikkerhetsavtale, autorisasjoner og kundens godkjenningsprosess.",
      ],
    },
  },
  {
    slug: "own-infrastructure",
    title: { en: "Own infrastructure", no: "Egen infrastruktur" },
    text: {
      en: "All production and data processing runs exclusively on our own controlled systems hosted on Norwegian infrastructure.",
      no: "All produksjon og databehandling kjører utelukkende på våre egne kontrollerte systemer hostet på norsk infrastruktur.",
    },
    paragraphs: {
      en: [
        "Spectr's production and data-processing model is based on controlled infrastructure, not unmanaged public tooling. Systems used for sensitive production work must be known, administered, monitored, and maintained under Spectr's own operational control, with Norwegian infrastructure as the baseline.",
        "This follows the same security logic used across serious defence and critical-infrastructure environments: reduce unnecessary dependencies, know where information is processed, and maintain a risk-based security posture across information systems, physical environments, people, and operational procedures.",
        "If a project involves classified information, protected infrastructure, or other regulated material, the relevant system and process requirements must be defined before work begins. That may include access control, logging, separation of duties, approval requirements, security agreements, or other measures required by Norwegian law or by the customer contract.",
      ],
      no: [
        "Spectrs produksjons- og databehandlingsmodell er basert på kontrollert infrastruktur, ikke uadministrerte offentlige verktøy. Systemer brukt til sensitivt produksjonsarbeid må være kjente, administrerte, overvåket og vedlikeholdt under Spectrs egen operative kontroll, med norsk infrastruktur som utgangspunkt.",
        "Dette følger samme sikkerhetslogikk som brukes i seriøse forsvars- og kritisk-infrastrukturmiljøer: reduser unødvendige avhengigheter, vit hvor informasjon behandles, og oppretthold en risikobasert sikkerhetsprofil på tvers av informasjonssystemer, fysiske miljøer, personell og operative prosedyrer.",
        "Hvis et prosjekt involverer klassifisert informasjon, beskyttet infrastruktur eller annet regulert materiale, må relevante system- og prosesskrav defineres før arbeidet starter. Det kan omfatte tilgangskontroll, logging, funksjonsseparasjon, godkjenningskrav, sikkerhetsavtaler eller andre tiltak påkrevd av norsk lov eller kundekontrakt.",
      ],
    },
  },
  {
    slug: "no-third-parties",
    title: { en: "No third parties", no: "Ingen tredjeparter" },
    text: {
      en: "We use no external vendors in our production chain. No data is shared with or processed by third parties.",
      no: "Vi bruker ingen eksterne leverandører i produksjonskjeden. Ingen data deles med eller behandles av tredjeparter.",
    },
    paragraphs: {
      en: [
        "Spectr's security position is that sensitive production work should not depend on unnecessary third parties. We avoid external vendors in the production chain because every additional processor, subcontractor, integration, or unmanaged service increases exposure and complicates accountability.",
        "No customer data is shared with or processed by third parties as part of Spectr production operations unless a customer-approved arrangement, legal requirement, or project-specific agreement requires it. When such an exception is required, it must be explicit, documented, and handled according to applicable data-protection, confidentiality, export-control, and security obligations.",
        "This is consistent with defence-sector supply-chain practice: know the supplier chain, reduce hidden dependencies, protect sensitive information, and make responsibility traceable. A shorter chain gives clearer control, clearer incident accountability, and fewer uncontrolled paths for information to move.",
      ],
      no: [
        "Spectrs sikkerhetsposisjon er at sensitivt produksjonsarbeid ikke bør avhenge av unødvendige tredjeparter. Vi unngår eksterne leverandører i produksjonskjeden fordi hver ekstra behandler, underleverandør, integrasjon eller uadministrert tjeneste øker eksponeringen og kompliserer ansvar.",
        "Ingen kundedata deles med eller behandles av tredjeparter som del av Spectrs produksjonsdrift med mindre en kundegodkjent ordning, juridisk krav eller prosjektspesifikk avtale krever det. Når et slikt unntak er nødvendig, må det være eksplisitt, dokumentert og håndtert i tråd med gjeldende personvern-, konfidensialitets-, eksportkontroll- og sikkerhetsforpliktelser.",
        "Dette er i tråd med forsvarssektorens leverandørkjedepraksis: kjenn leverandørkjeden, reduser skjulte avhengigheter, beskytt sensitiv informasjon og gjør ansvar sporbar. En kortere kjede gir tydeligere kontroll, tydeligere hendelsesansvar og færre ukontrollerte veier for informasjon.",
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
        "Full control means Spectr keeps direct responsibility for the processes that shape the product: requirements, engineering, production, verification, documentation, delivery, and support. We do not treat control as a slogan; it is the operating requirement behind the way the company is structured.",
        "For customers evaluating technology in demanding operational environments, control must be visible. Decisions should be traceable, changes should be deliberate, and sensitive work should be handled by accountable personnel using controlled processes. That is the reason we keep the chain between development and delivery short.",
        "Where a project is governed by customer security requirements, classified procurement rules, or national information-security obligations, internal control must be aligned with those requirements. This may include need-to-know access, controlled documentation, technical separation, personnel restrictions, approval gates, and written handling rules before delivery.",
      ],
      no: [
        "Full kontroll betyr at Spectr beholder direkte ansvar for prosessene som former produktet: krav, ingeniørarbeid, produksjon, verifikasjon, dokumentasjon, leveranse og støtte. Vi behandler ikke kontroll som et slagord; det er driftskravet bak måten selskapet er strukturert på.",
        "For kunder som evaluerer teknologi i krevende operative miljøer må kontroll være synlig. Beslutninger bør være sporbare, endringer bevisste, og sensitivt arbeid håndteres av ansvarlig personell med kontrollerte prosesser. Det er grunnen til at vi holder kjeden mellom utvikling og leveranse kort.",
        "Der et prosjekt styres av kundens sikkerhetskrav, klassifiserte innkjøpsregler eller nasjonale informasjonssikkerhetsforpliktelser, må intern kontroll være tilpasset disse kravene. Det kan omfatte need-to-know-tilgang, kontrollert dokumentasjon, teknisk separasjon, personellrestriksjoner, godkjenningsporter og skriftlige håndteringsregler før leveranse.",
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
        "Spectr treats confidentiality as a baseline condition for working with security, defence, logistics, and critical-infrastructure customers. Operational context, customer identity, technical requirements, mission needs, product details, and support information are handled as sensitive unless the customer has clearly approved wider disclosure.",
        "Confidentiality applies to people, systems, documents, communications, and physical handling. Access must be based on need-to-know, sensitive material must not move through unnecessary channels, and information should be classified, labelled, stored, and shared according to its sensitivity and the applicable project requirements.",
        "If work involves classified information under Norwegian rules, confidentiality is not only a business promise. Handling must follow the relevant legal and contractual framework, including security agreements, authorisations, personnel access requirements, and customer-defined controls. Spectr's public commitment is to treat sensitive information conservatively and to formalise stricter handling where the project requires it.",
      ],
      no: [
        "Spectr behandler konfidensialitet som et grunnvilkår for arbeid med sikkerhets-, forsvars-, logistikk- og kritisk-infrastrukturkunder. Operasjonell kontekst, kundeidentitet, tekniske krav, oppdragsbehov, produktdetaljer og støtteinformasjon håndteres som sensitiv med mindre kunden uttrykkelig har godkjent bredere offentliggjøring.",
        "Konfidensialitet gjelder personell, systemer, dokumenter, kommunikasjon og fysisk håndtering. Tilgang må baseres på need-to-know, sensitivt materiale må ikke flyte gjennom unødvendige kanaler, og informasjon bør klassifiseres, merkes, lagres og deles i tråd med sensitivitet og gjeldende prosjektkrav.",
        "Hvis arbeid involverer klassifisert informasjon under norske regler, er konfidensialitet ikke bare et forretningsløfte. Håndtering må følge relevant juridisk og kontraktsmessig rammeverk, inkludert sikkerhetsavtaler, autorisasjoner, personelltilgangskrav og kundedefinerte kontroller. Spectrs offentlige forpliktelse er å behandle sensitiv informasjon konservativt og formalisere strengere håndtering der prosjektet krever det.",
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
        "Spectr operates under Norwegian law and structures its work around the legal requirements that apply to security-sensitive technology, data protection, confidentiality, procurement, and controlled information. The Norwegian Security Act is designed to protect national security interests, classified information, critical systems, objects, infrastructure, and activities that are important to fundamental national functions.",
        "Where the Security Act or classified-procurement rules apply, the correct obligations must be defined before the work starts. That may include security agreements, information classification and marking, need-to-know access, approval of systems, personnel authorisation, supplier controls, and customer-specific security instructions. Spectr does not treat such obligations as optional or informal.",
        "For personal data and business information, Spectr follows GDPR principles such as lawful basis, purpose limitation, data minimisation, confidentiality, integrity, and accountability. Legal compliance is paired with practical security controls so the operating model remains clear: Norwegian accountability, controlled information handling, and risk-based protection appropriate to the work being performed.",
      ],
      no: [
        "Spectr opererer under norsk lov og strukturerer arbeidet rundt de juridiske kravene som gjelder sikkerhetssensitiv teknologi, personvern, konfidensialitet, innkjøp og kontrollert informasjon. Sikkerhetsloven er utformet for å beskytte nasjonale sikkerhetsinteresser, klassifisert informasjon, kritiske systemer, objekter, infrastruktur og aktiviteter som er viktige for grunnleggende nasjonale funksjoner.",
        "Der sikkerhetsloven eller klassifiserte innkjøpsregler gjelder, må riktige forpliktelser defineres før arbeidet starter. Det kan omfatte sikkerhetsavtaler, informasjonsklassifisering og merking, need-to-know-tilgang, godkjenning av systemer, personellautorisasjon, leverandørkontroller og kundespesifikke sikkerhetsinstrukser. Spectr behandler ikke slike forpliktelser som valgfrie eller uformelle.",
        "For personopplysninger og forretningsinformasjon følger Spectr GDPR-prinsipper som lovlig grunnlag, formålsbegrensning, dataminimering, konfidensialitet, integritet og ansvarlighet. Juridisk etterlevelse kombineres med praktiske sikkerhetskontroller slik at driftsmodellen forblir tydelig: norsk ansvarlighet, kontrollert informasjonshåndtering og risikobasert beskyttelse tilpasset arbeidet som utføres.",
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

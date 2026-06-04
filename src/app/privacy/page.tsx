import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";

export const metadata: Metadata = { title: "Privacy Policy" };

const sections = [
  {
    title: "Information we collect",
    text: "When you contact Spectr, request information, apply for careers, or engage with our website, we may collect details such as your name, email address, phone number, organization, role, country, product interest, procurement context, and message content. For defense, aerospace, or military-related inquiries, we may also request information needed to assess eligibility, end use, end user, operational context, and compliance requirements.",
  },
  {
    title: "How we use information",
    text: "We use submitted information to respond to inquiries, coordinate product or documentation requests, evaluate operational fit, perform security and qualification review, support recruitment, maintain business records, and improve website communication. Where relevant, we may use information to support screening under Norwegian law, applicable EU/EEA rules, sanctions regimes, export-control requirements, NATO-aligned procurement expectations, and defense-sector compliance procedures.",
  },
  {
    title: "Defense and military service inquiries",
    text: "Spectr operates in a sensitive sector. We may review inquiries from government, defense, security, law-enforcement, and qualified commercial operators before responding or providing further information. We may decline, delay, or restrict engagement where an inquiry raises legal, ethical, export-control, sanctions, end-use, national-security, or operational-safety concerns.",
  },
  {
    title: "Norwegian, EEA, NATO, and export-control context",
    text: "Spectr is based in Norway and expects to operate in accordance with Norwegian law, applicable EEA privacy rules, and relevant defense, security, sanctions, and export-control requirements. References to NATO or NATO-aligned requirements do not imply that Spectr is endorsed by NATO; they reflect that some customers, partners, or compliance reviews may involve NATO member-state standards, procurement expectations, or allied defense controls.",
  },
  {
    title: "Cookies and website data",
    text: "We may use essential cookies and similar technologies to operate the website, remember cookie preferences, protect the site, and understand basic usage. If analytics, embedded media, marketing, or third-party tools are introduced, they may use additional cookies subject to your consent where required by law. You can control cookies through the banner on the site and through your browser settings.",
  },
  {
    title: "Sharing and processors",
    text: "We do not sell personal information. We may share information with service providers that host the website, support communications, process forms, provide security, or help us operate our business. We may also share information when required by law, regulation, court order, export-control screening, sanctions review, government request, or to protect Spectr, our users, or public safety.",
  },
  {
    title: "International transfers",
    text: "Because website infrastructure and service providers may operate across borders, information may be processed outside Norway. Where required, Spectr will seek to use appropriate safeguards for international transfers, including EEA-recognized mechanisms and vendor security reviews.",
  },
  {
    title: "Security",
    text: "We use reasonable technical and organizational measures to protect information. No website or online transmission is fully secure. Defense-related inquiries should not include classified information, controlled technical data, weapons instructions, sensitive operational plans, or other restricted material unless Spectr has expressly approved a secure handling process.",
  },
  {
    title: "Retention",
    text: "We keep inquiry information only as long as needed for business, support, security, compliance, audit, export-control, sanctions, recruitment, and legal purposes. Defense-sector records may be retained longer where necessary to document screening, eligibility, end-use review, or regulatory compliance.",
  },
  {
    title: "Your rights",
    text: "Depending on where you are located, you may have rights to access, correct, delete, restrict, or object to certain processing of your personal information. Some requests may be limited where Spectr must retain information for legal, defense-sector, export-control, sanctions, security, or recordkeeping reasons.",
  },
  {
    title: "Contact",
    text: "For privacy questions or requests, contact Spectr through the contact page with Privacy Request in the message. Do not send classified, restricted, or sensitive operational information through the public contact form.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="brand-font bg-black px-5 pb-20 pt-36 text-white sm:px-8 lg:pb-28 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <ScrollRevealHeading
              as="h1"
              revealOnMount
              className="max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.075em] sm:text-8xl lg:text-[9.5rem]"
            >
              Privacy Policy
            </ScrollRevealHeading>
            <p className="mt-8 max-w-2xl text-sm leading-7 text-white/58">
              Last updated: June 4, 2026
            </p>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-4">
              {sections.map((section) => (
                <article key={section.title} className="bg-surface p-7 sm:p-8">
                  <h2 className="text-3xl font-semibold tracking-[-0.055em] text-fg">{section.title}</h2>
                  <p className="mt-5 text-sm leading-7 text-muted sm:text-base">{section.text}</p>
                  {section.title === "Contact" ? (
                    <Link
                      href="/contact"
                      className="mt-7 inline-flex w-fit items-center gap-3 bg-fg px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-bg hover:opacity-80"
                    >
                      Contact Spectr
                      <span aria-hidden="true">→</span>
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}

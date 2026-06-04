import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";

export const metadata: Metadata = { title: "Terms of Service" };

const sections = [
  {
    title: "Use of the website",
    text: "You may use this website to learn about Spectr, request information, and contact our team. You agree not to misuse the site, interfere with its operation, attempt unauthorized access, scrape restricted content, upload malicious code, or use the website in a way that violates Norwegian law, applicable EEA rules, sanctions regimes, export-control requirements, or other applicable laws.",
  },
  {
    title: "Product information",
    text: "Website content is provided for general information only. Product descriptions, availability, specifications, performance statements, payload references, military-service descriptions, and services may change without notice. Nothing on the website is an offer to sell, transfer, export, deploy, or provide controlled goods, software, technical data, weapons-related capability, or military services.",
  },
  {
    title: "Defense, security, and military services",
    text: "Spectr may provide products or services for defense, security, aerospace, government, or qualified operational users. Any such engagement is subject to screening, eligibility review, end-use and end-user assessment, contract terms, operational limitations, export-control review, sanctions review, and any approvals required under Norwegian law or other applicable regimes. Spectr may refuse or discontinue engagement at its discretion where legal, safety, ethical, operational, or national-security concerns arise.",
  },
  {
    title: "Norwegian law and NATO context",
    text: "Spectr is based in Norway and expects to operate in accordance with Norwegian law and applicable defense, security, procurement, export-control, sanctions, and privacy requirements. References to NATO, allied defense, or NATO-aligned standards do not imply endorsement, authorization, or procurement by NATO. They refer to possible standards, expectations, or controls relevant to customers or partners in NATO member states or allied defense environments.",
  },
  {
    title: "Inquiries, qualification, and no obligation",
    text: "Submitting a request does not create a purchase agreement, partnership, agency relationship, procurement commitment, or obligation for Spectr to provide products, documentation, demonstrations, pricing, services, or technical information. Spectr may require additional identity, organization, country, end-use, end-user, and compliance information before responding.",
  },
  {
    title: "Intellectual property",
    text: "Spectr names, logos, visuals, text, product descriptions, specifications, diagrams, videos, renderings, and website materials are owned by Spectr or its licensors and may not be copied, modified, redistributed, reverse engineered, or reused without written permission. No license is granted except the limited right to view the website for lawful informational purposes.",
  },
  {
    title: "Restricted information",
    text: "Do not submit classified information, controlled technical data, weapons instructions, tactical plans, sensitive operational details, third-party confidential information, or personal data you are not authorized to share through public website forms. Spectr may delete, restrict, or report submissions that appear unlawful, unsafe, classified, controlled, or inappropriate for public channels.",
  },
  {
    title: "Compliance and prohibited use",
    text: "You may not use this website or Spectr-provided information to violate sanctions, export controls, arms-control rules, procurement rules, anti-corruption laws, privacy laws, or security restrictions. You may not use website content to develop, modify, procure, or deploy systems unlawfully or without required authorization.",
  },
  {
    title: "Cookies and consent",
    text: "The website may use cookies and similar technologies for essential operation, preference storage, security, analytics, and site improvement. Where required, non-essential cookies will be subject to consent. You can manage preferences through the cookie banner and browser settings.",
  },
  {
    title: "Limitation of liability",
    text: "The website is provided as is and as available. To the maximum extent permitted by law, Spectr is not liable for indirect, incidental, special, punitive, consequential, operational, procurement, data-loss, business-interruption, or security-related damages arising from website use, reliance on website content, or inability to access the website.",
  },
  {
    title: "Governing law",
    text: "Unless otherwise agreed in writing, these website terms are intended to be governed by Norwegian law, without limiting mandatory rights or obligations that may apply under other applicable laws. Any product, defense, military-service, or procurement relationship will require separate written terms.",
  },
];

export default function TermsPage() {
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
              Terms of Service
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

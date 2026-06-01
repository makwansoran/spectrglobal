import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";

export const metadata: Metadata = { title: "Privacy Policy" };

const sections = [
  {
    title: "Information we collect",
    text: "When you contact Spectr, we may collect details such as your name, email address, phone number, organization, product interest, and message content.",
  },
  {
    title: "How we use information",
    text: "We use submitted information to respond to inquiries, coordinate product or documentation requests, evaluate operational fit, and improve our communication with prospective partners.",
  },
  {
    title: "Sharing",
    text: "We do not sell personal information. We may share information with service providers when needed to operate the website, manage communications, or comply with legal obligations.",
  },
  {
    title: "Retention",
    text: "We keep inquiry information only as long as needed for business, support, security, and legal purposes.",
  },
  {
    title: "Contact",
    text: "For privacy questions or requests, contact Spectr through the contact page with Privacy Request in the message.",
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
              Last updated: May 31, 2026
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

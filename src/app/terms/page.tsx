import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";

export const metadata: Metadata = { title: "Terms of Service" };

const sections = [
  {
    title: "Use of the website",
    text: "You may use this website to learn about Spectr, request information, and contact our team. You agree not to misuse the site or interfere with its operation.",
  },
  {
    title: "Product information",
    text: "Website content is provided for general information only. Product descriptions, availability, specifications, and services may change without notice.",
  },
  {
    title: "Inquiries and qualification",
    text: "Submitting a request does not create a purchase agreement, partnership, or obligation for Spectr to provide products or services. Some requests may require additional review.",
  },
  {
    title: "Intellectual property",
    text: "Spectr names, visuals, text, and website materials are owned by Spectr or its licensors and may not be copied or reused without permission.",
  },
  {
    title: "Limitation of liability",
    text: "The website is provided as is. To the maximum extent permitted by law, Spectr is not liable for indirect or consequential damages arising from website use.",
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

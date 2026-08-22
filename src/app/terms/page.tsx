import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { pickLegalField, termsSections } from "@/lib/legal";
import { buildPageMetadata } from "@/lib/metadata";

const lastUpdated = "Last updated 21 July 2026";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms & conditions",
  description: `The terms governing use of the Spectr website and services. ${lastUpdated}.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <PageHeader title="Terms & conditions" intro={lastUpdated} />

        <section className="pb-28">
          <div className="container-x">
            <div className="mx-auto max-w-3xl space-y-4">
              {termsSections.map((section) => (
                <article key={pickLegalField(section.title)} className="card p-7 sm:p-8">
                  <h2 className="display text-2xl text-fg sm:text-3xl">
                    {pickLegalField(section.title)}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted">{pickLegalField(section.text)}</p>
                  {section.bullets ? (
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-muted">
                      {pickLegalField(section.bullets).map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

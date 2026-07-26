import type { Metadata } from "next";
import { ArrowIcon, Button } from "@/components/button";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { PageHeader } from "@/components/page-header";
import { cookieSections, pickLegalField, privacySections } from "@/lib/legal";
import { buildPageMetadata } from "@/lib/metadata";

const lastUpdated = "Last updated 21 July 2026";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy policy",
  description: `How Spectr collects, uses and protects personal data. ${lastUpdated}.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <PageHeader eyebrow="Legal" title="Privacy policy" intro={lastUpdated} />

        <section className="pb-24">
          <div className="container-x">
            <div className="mx-auto max-w-3xl space-y-4">
              {privacySections.map((section) => (
                <article key={pickLegalField(section.title)} className="card p-7 sm:p-8">
                  <h2 className="brand-font text-xl font-semibold tracking-tight text-fg">
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
                  {section.hasContactLink ? (
                    <Button href="/contact" className="mt-6">
                      Contact us
                      <ArrowIcon />
                    </Button>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-28">
          <div className="container-x">
            <div className="mx-auto max-w-3xl">
              <h2 className="display text-2xl text-gradient sm:text-3xl">Cookies</h2>
              <p className="mt-5 text-sm leading-7 text-muted">
                We keep cookie use to a minimum and ask before setting anything that is not strictly
                necessary. The categories below describe what may be stored on your device.
              </p>
              <div className="mt-8 space-y-4">
                {cookieSections.map((section) => (
                  <article key={pickLegalField(section.title)} className="card p-7">
                    <h3 className="brand-font text-lg font-semibold tracking-tight text-fg">
                      {pickLegalField(section.title)}
                    </h3>
                    <p className="mt-3.5 text-sm leading-7 text-muted">
                      {pickLegalField(section.text)}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

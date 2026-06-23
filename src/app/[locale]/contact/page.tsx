import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { buildPageMetadata, localizedPath } from "@/lib/metadata";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return buildPageMetadata({
    title: t("title"),
    description: t("trustIntro"),
    path: localizedPath(locale, "/contact"),
    locale,
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Contact" });

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <section className="px-5 pb-20 pt-32 sm:px-8 lg:pb-28 lg:pt-36">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_320px] lg:items-start">
            <div>
              <ScrollRevealHeading
                as="h1"
                revealOnMount
                className="text-5xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-7xl lg:text-8xl"
              >
                {t("title")}
              </ScrollRevealHeading>
              <Suspense fallback={null}>
                <ContactForm />
              </Suspense>
            </div>

            <aside className="bg-surface p-7 sm:p-8 lg:sticky lg:top-28">
              <h2 className="text-2xl font-semibold tracking-[-0.05em] text-fg">{t("trustTitle")}</h2>
              <p className="mt-5 text-sm leading-7 text-muted">{t("trustIntro")}</p>
              <dl className="mt-8 space-y-5 text-sm">
                <div>
                  <dt className="label">{t("emailLabel")}</dt>
                  <dd className="mt-2">
                    <a href="mailto:makwan@spectr.no" className="text-fg underline underline-offset-4 hover:opacity-70">
                      makwan@spectr.no
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="label">{t("phoneLabel")}</dt>
                  <dd className="mt-2">
                    <a href="tel:+4746503934" className="text-fg underline underline-offset-4 hover:opacity-70">
                      {t("phoneValue")}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="label">{t("orgLabel")}</dt>
                  <dd className="mt-2 text-fg">{t("orgValue")}</dd>
                </div>
                <div>
                  <dt className="label">{t("locationLabel")}</dt>
                  <dd className="mt-2 text-fg">{t("locationValue")}</dd>
                </div>
              </dl>
              <p className="mt-8 text-xs leading-6 text-muted">{t("securityNote")}</p>
            </aside>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}

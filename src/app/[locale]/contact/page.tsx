import type { Metadata } from "next";
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
        <section className="brand-font px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
          <div className="mx-auto max-w-[42rem]">
            <ScrollRevealHeading
              as="h1"
              revealOnMount
              className="text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-fg sm:text-7xl"
            >
              {t("title")}
            </ScrollRevealHeading>
            <p className="mt-6 text-base leading-7 text-muted sm:text-lg">{t("trustIntro")}</p>

            <div className="mt-12">
              <ContactForm />
            </div>

            <dl className="mt-12 grid gap-6 border-t border-border pt-10 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{t("emailLabel")}</dt>
                <dd className="mt-2">
                  <a href="mailto:makwan@spectr.no" className="text-fg underline underline-offset-4 hover:opacity-70">
                    makwan@spectr.no
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{t("phoneLabel")}</dt>
                <dd className="mt-2">
                  <a href="tel:+4746503934" className="text-fg underline underline-offset-4 hover:opacity-70">
                    {t("phoneValue")}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{t("orgLabel")}</dt>
                <dd className="mt-2 text-fg">{t("orgValue")}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{t("locationLabel")}</dt>
                <dd className="mt-2 text-fg">{t("locationValue")}</dd>
              </div>
            </dl>
            <p className="mt-8 text-xs leading-6 text-muted">{t("securityNote")}</p>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}

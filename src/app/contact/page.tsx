import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { OpenGetStartedOnMount } from "@/components/open-get-started-on-mount";
import { PageHeader } from "@/components/page-header";
import { GetStartedButton } from "@/components/get-started-button";
import { buildPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

const intro =
  "Whether you want Spectr OS on your floor, a partnership conversation, or investor materials — use Get Started and we will route you to the right team.";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: intro,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <OpenGetStartedOnMount />
      <main id="main-content" className="flex-1 bg-white">
        <PageHeader title="Get in touch." intro={intro}>
          <GetStartedButton size="lg" label="Open form" openSidebar />
        </PageHeader>

        <section className="pb-28">
          <div className="container-x">
            <div className="mx-auto max-w-xl text-sm leading-7 text-muted">
              <p>
                Prefer email? Write directly to{" "}
                <a href={`mailto:${site.email}`} className="text-fg underline underline-offset-4">
                  {site.email}
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

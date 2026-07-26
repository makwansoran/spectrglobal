import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { PageHeader } from "@/components/page-header";
import { buildPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

const intro =
  "Whether you want Spectr C2 running on your floor, a Droid pilot, or just a straight answer about whether we can help — this reaches us directly.";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: intro,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <PageHeader title="Tell us about your operation." intro={intro} />

        <section className="pb-28">
          <div className="container-x">
            <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
              <div className="card p-7 sm:p-10">
                <ContactForm />
              </div>

              <aside>
                <dl className="space-y-8">
                  <ContactDetail label="Email">
                    <a
                      href={`mailto:${site.email}`}
                      className="text-fg underline underline-offset-4 hover:text-accent"
                    >
                      {site.email}
                    </a>
                  </ContactDetail>
                  <ContactDetail label="Phone">
                    <a
                      href={site.phoneHref}
                      className="text-fg underline underline-offset-4 hover:text-accent"
                    >
                      {site.phone}
                    </a>
                  </ContactDetail>
                  <ContactDetail label="Registered entity">
                    <span className="text-fg">{site.legalName}</span>
                    <span className="mt-1 block text-muted">Org. {site.orgNumber}</span>
                  </ContactDetail>
                  <ContactDetail label="Location">
                    <span className="text-fg">{site.location}</span>
                  </ContactDetail>
                </dl>

                <div className="mt-10 border-t border-border pt-8">
                  <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    Response times
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted">
                    We reply to everything within one working day. Requests for Spectr C2 get a
                    scoping call, not a sales sequence — there is nothing to sell you.
                  </p>
                </div>

                <p className="mt-8 text-xs leading-6 text-muted">
                  Data submitted through this form is processed under our{" "}
                  <a href="/privacy" className="underline underline-offset-4 hover:text-fg">
                    privacy policy
                  </a>{" "}
                  and used only to respond to your enquiry.
                </p>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ContactDetail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{label}</dt>
      <dd className="mt-2.5 text-sm leading-7">{children}</dd>
    </div>
  );
}

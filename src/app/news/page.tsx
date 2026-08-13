import type { Metadata } from "next";
import Image from "next/image";
import { ArrowIcon, Button } from "@/components/button";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { newsItems } from "@/lib/content";
import { buildPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

const intro = "Announcements, product releases and progress from the Spectr team.";

export const metadata: Metadata = buildPageMetadata({
  title: "News",
  description: intro,
  path: "/news",
});

export default function NewsPage() {
  return (
    <>
      <main id="main-content" className="flex-1">
        <PageHeader title="What we are shipping and why." intro={intro} />

        <section className="pb-28">
          <div className="container-x">
            <div className="mx-auto max-w-3xl">
              {newsItems.length > 0 ? (
                <ul>
                  {newsItems.map((item) => (
                    <li key={item.id} className="grid gap-5 py-9 sm:grid-cols-[150px_1fr] sm:gap-8">
                      <time className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                        {item.date}
                      </time>
                      <div>
                        <div className="bevel-panel-image relative mb-5 aspect-[16/9] overflow-hidden bg-surface">
                          <Image
                            src={item.image}
                            alt={item.imageAlt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 40rem"
                          />
                        </div>
                        <h2 className="brand-font text-xl font-semibold tracking-tight text-fg">
                          <a href={item.href} className="hover:opacity-70">
                            {item.title}
                          </a>
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-muted">{item.summary}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="card p-10 text-center sm:p-16">
                  <h2 className="brand-font text-xl font-semibold tracking-tight text-fg">
                    Nothing published yet.
                  </h2>
                  <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted">
                    We are heads-down building. Announcements will land here first — follow along on
                    LinkedIn in the meantime, or write to us directly for press enquiries.
                  </p>
                  <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button href="/contact">
                      Press enquiries
                      <ArrowIcon />
                    </Button>
                    <Button href={site.social.linkedin} external>
                      Follow on LinkedIn
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

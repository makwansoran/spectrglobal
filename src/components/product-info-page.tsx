import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ProductFaq } from "@/components/product-faq";
import { ProductSectionNav } from "@/components/product-section-nav";
import { Link } from "@/i18n/navigation";

type InfoItem = {
  title: string;
  description: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type CtaBlock = {
  title: string;
  description: string;
  cta: string;
  href: string;
};

export type ProductInfoContent = {
  eyebrow: string;
  title: string;
  tagline: string;
  learnMore: string;
  nav: {
    capabilities: string;
    architecture: string;
    applications: string;
    faqs: string;
    getStarted: string;
  };
  capabilities: { title: string; items: InfoItem[] };
  architecture: { title: string; items: InfoItem[] };
  applications: { title: string; items: InfoItem[] };
  banner: { title: string; description: string; cta: string };
  faqs: { title: string; items: FaqItem[] };
  getStarted: {
    title: string;
    primary: CtaBlock;
    secondary: CtaBlock;
  };
};

export function ProductInfoPage({ content }: { content: ProductInfoContent }) {
  const navItems = [
    { id: "capabilities", label: content.nav.capabilities },
    { id: "architecture", label: content.nav.architecture },
    { id: "applications", label: content.nav.applications },
    { id: "faqs", label: content.nav.faqs },
    { id: "get-started", label: content.nav.getStarted },
  ];

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <section className="px-5 pb-12 pt-36 sm:px-8 lg:pb-16 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <p className="label">{content.eyebrow}</p>
            <h1 className="brand-font mt-5 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-7xl lg:text-8xl">
              {content.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
              {content.tagline}
            </p>
          </div>
        </section>

        <ProductSectionNav items={navItems} />

        <div className="px-5 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <InfoSection id="capabilities" title={content.capabilities.title} items={content.capabilities.items} learnMore={content.learnMore} />
            <InfoSection id="architecture" title={content.architecture.title} items={content.architecture.items} learnMore={content.learnMore} />

            <aside className="border-y border-border py-16 lg:py-20">
              <div className="max-w-3xl">
                <h2 className="brand-font text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  {content.banner.title}
                </h2>
                <p className="mt-5 text-base leading-8 text-muted sm:text-lg">{content.banner.description}</p>
                <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent hover:opacity-80">
                  {content.banner.cta}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </aside>

            <InfoSection id="applications" title={content.applications.title} items={content.applications.items} learnMore={content.learnMore} />

            <section id="faqs" className="scroll-mt-32 py-16 lg:py-24">
              <ProductFaq title={content.faqs.title} items={content.faqs.items} />
            </section>

            <section id="get-started" className="scroll-mt-32 border-t border-border py-16 lg:py-24">
              <h2 className="brand-font text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                {content.getStarted.title}
              </h2>
              <div className="mt-10 grid gap-6 lg:grid-cols-2">
                <CtaCard block={content.getStarted.primary} />
                <CtaCard block={content.getStarted.secondary} />
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function InfoSection({
  id,
  title,
  items,
  learnMore,
}: {
  id: string;
  title: string;
  items: InfoItem[];
  learnMore: string;
}) {
  return (
    <section id={id} className="scroll-mt-32 border-b border-border py-16 lg:py-24">
      <h2 className="brand-font text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{title}</h2>
      <div className="mt-12 grid gap-x-12 gap-y-14 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.title} className="flex flex-col">
            <h3 className="brand-font text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
              {item.title}
            </h3>
            <p className="mt-4 flex-1 text-base leading-8 text-muted">{item.description}</p>
            <Link
              href="/contact"
              className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-accent hover:opacity-80"
            >
              {learnMore}
              <span aria-hidden>→</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function CtaCard({ block }: { block: CtaBlock }) {
  return (
    <div className="flex flex-col border border-border bg-surface/60 p-8 sm:p-10">
      <h3 className="brand-font text-2xl font-semibold tracking-[-0.03em]">{block.title}</h3>
      <p className="mt-4 flex-1 text-base leading-8 text-muted">{block.description}</p>
      <Link href={block.href} className="pill pill--primary mt-8 w-fit">
        {block.cta}
      </Link>
    </div>
  );
}

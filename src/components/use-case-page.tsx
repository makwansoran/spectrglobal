import Image from "next/image";
import Link from "next/link";
import { UseCaseCta } from "@/components/use-case-cta";
import { UseCaseFocus } from "@/components/use-case-focus";
import { industryPages, type IndustryPage } from "@/lib/use-cases";
import "./use-case-page.css";

export function UseCasePageView({ page }: { page: IndustryPage }) {
  return (
    <article className="uc-page">
      <div className="uc-hero">
        <Image
          src={page.image}
          alt={page.imageAlt}
          fill
          priority
          className="uc-hero__image"
          sizes="100vw"
        />
      </div>

      <header className="uc-banner">
        <div className="uc-banner__inner">
          <h1>{page.bannerTitle}</h1>
        </div>
      </header>

      <section className="uc-intro">
        <div className="uc-wrap">
          <div className="uc-intro__grid">
            <h2>{page.headline}</h2>
            <p>{page.columnOne}</p>
            <p>{page.columnTwo}</p>
          </div>
          <hr className="uc-rule" />
        </div>
      </section>

      <UseCaseFocus focuses={page.focuses} />

      <section className="uc-caps">
        <div className="uc-wrap">
          <h2>In the runtime</h2>
          <ul>
            {page.capabilities.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="uc-cta">
        <div className="uc-wrap">
          <div className="uc-cta__box">
            <h2>Run this on Spectr OS</h2>
            <p>Free for enterprise customers — permanently. Map the work in days, not a transformation programme.</p>
            <UseCaseCta />
          </div>
        </div>
      </section>

      <nav className="uc-more" aria-label="Other use cases">
        <div className="uc-wrap">
          <h2>Other use cases</h2>
          <ul>
            {industryPages.map((item) => (
              <li key={item.slug}>
                <Link href={item.href} className={item.slug === page.slug ? "is-current" : undefined}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </article>
  );
}

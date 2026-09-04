import Image from "next/image";
import Link from "next/link";
import { UseCaseCta } from "@/components/use-case-cta";
import { solutionsPage } from "@/lib/solutions-page";
import "./use-case-page.css";
import "./solutions-page.css";

export function SolutionsPageView() {
  const page = solutionsPage;

  return (
    <article className="uc-page">
      <div className="uc-hero">
        <Image
          src={page.heroImage}
          alt={page.heroImageAlt}
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

      <nav className="sol-jump" aria-label="Industries">
        <div className="uc-wrap">
          <ul className="sol-jump__list">
            {page.industries.map((industry) => (
              <li key={industry.slug}>
                <a href={`#${industry.slug}`}>{industry.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <section className="sol-method" aria-labelledby="sol-method-title">
        <div className="uc-wrap">
          <div className="sol-method__head">
            <h2 id="sol-method-title">{page.methodTitle}</h2>
            <p>{page.methodLead}</p>
          </div>

          <ol className="sol-loop">
            {page.loop.map((item) => (
              <li key={item.index}>
                <span>{item.index}</span>
                <strong>{item.title}</strong>
              </li>
            ))}
          </ol>

          <ol className="sol-steps">
            {page.steps.map((step) => (
              <li key={step.index}>
                <p className="sol-steps__index">{step.index}</p>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sol-industries" aria-labelledby="sol-industries-title">
        <div className="uc-wrap">
          <div className="sol-industries__head">
            <h2 id="sol-industries-title">{page.industriesTitle}</h2>
            <p>{page.industriesLead}</p>
          </div>
        </div>

        {page.industries.map((industry, index) => (
          <section
            key={industry.slug}
            id={industry.slug}
            className={`sol-industry${index % 2 ? " sol-industry--flip" : ""}`}
            aria-labelledby={`${industry.slug}-title`}
          >
            <div className="uc-wrap">
              <div className="sol-industry__grid">
                <div className="sol-industry__media">
                  <Image
                    src={industry.image}
                    alt={industry.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 960px) 100vw, 46vw"
                  />
                </div>
                <div className="sol-industry__copy">
                  <p className="sol-industry__index">
                    <span>{industry.index}</span>
                    {industry.name}
                  </p>
                  <h3 id={`${industry.slug}-title`}>{industry.headline}</h3>
                  <p>{industry.broken}</p>
                  <p>{industry.help}</p>
                  <ol className="sol-map">
                    {industry.map.map((item) => (
                      <li key={item.title}>
                        <strong>{item.title}</strong>
                        <p>{item.body}</p>
                      </li>
                    ))}
                  </ol>
                  <Link className="sol-industry__link" href={industry.href}>
                    Open {industry.name} →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))}
      </section>

      <section className="sol-outcomes uc-caps" aria-labelledby="sol-outcomes-title">
        <div className="uc-wrap">
          <h2 id="sol-outcomes-title">{page.outcomesTitle}</h2>
          <ul>
            {page.outcomes.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sol-software" aria-labelledby="sol-software-title">
        <div className="uc-wrap">
          <h2 id="sol-software-title">{page.softwareTitle}</h2>
          <ul>
            {page.software.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <span>Learn more →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="uc-cta">
        <div className="uc-wrap">
          <div className="uc-cta__box">
            <h2>{page.ctaTitle}</h2>
            <p>{page.ctaBody}</p>
            <UseCaseCta />
          </div>
        </div>
      </section>
    </article>
  );
}

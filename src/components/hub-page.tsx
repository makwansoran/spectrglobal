import Image from "next/image";
import Link from "next/link";
import { UseCaseCta } from "@/components/use-case-cta";
import type { HubPage } from "@/lib/hubs";
import { customerQuotes } from "@/lib/hubs";
import "./use-case-page.css";

export function HubPageView({ page }: { page: HubPage }) {
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

      {page.path === "/customers" ? (
        <section className="hub-quotes">
          <div className="uc-wrap">
            <h2>{page.quotesTitle ?? "Impact"}</h2>
            {customerQuotes.slice(0, 4).map((item) => (
              <blockquote key={item.company} className="hub-quote">
                <p>{item.quote}</p>
                <footer>
                  {item.person}, {item.role} — {item.company}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      ) : null}

      {page.cards?.length ? (
        <section className="hub-cards">
          <div className="uc-wrap">
            {page.cardsTitle ? <h2>{page.cardsTitle}</h2> : null}
            <ul>
              {page.cards.map((card) => (
                <li key={card.href + card.title}>
                  <Link href={card.href}>
                    <h3>{card.title}</h3>
                    <p>{card.body}</p>
                    <span>Learn more →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {page.posts?.length ? (
        <section className="hub-posts">
          <div className="uc-wrap">
            {page.postsTitle ? <h2>{page.postsTitle}</h2> : null}
            <ul>
              {page.posts.map((post) => (
                <li key={post.slug}>
                  <Link href={post.href}>
                    <time dateTime={post.date}>{post.date}</time>
                    <div>
                      <h3>{post.title}</h3>
                      <p>{post.dek}</p>
                    </div>
                    <div className="hub-posts__thumb">
                      <Image src={post.image} alt={post.imageAlt} fill className="object-cover" sizes="11rem" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {page.capabilities?.length ? (
        <section className="uc-caps">
          <div className="uc-wrap">
            {page.capabilitiesTitle ? <h2>{page.capabilitiesTitle}</h2> : null}
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
      ) : null}

      <section className="uc-cta">
        <div className="uc-wrap">
          <div className="uc-cta__box">
            <h2>Get started with Spectr OS</h2>
            <p>Free for enterprise customers — permanently. Map the work in days, not a transformation programme.</p>
            <UseCaseCta />
          </div>
        </div>
      </section>
    </article>
  );
}

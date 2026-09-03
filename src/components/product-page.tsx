import Image from "next/image";
import Link from "next/link";
import { UseCaseCta } from "@/components/use-case-cta";
import { productCards, productPages } from "@/lib/hubs";
import "./use-case-page.css";

type ProductPage = (typeof productPages)[number];

export function ProductPageView({ page }: { page: ProductPage }) {
  return (
    <article className="uc-page">
      <div className="uc-hero">
        <Image src={page.image} alt={page.imageAlt} fill priority className="uc-hero__image" sizes="100vw" />
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
            <UseCaseCta />
          </div>
        </div>
      </section>
      <nav className="uc-more" aria-label="Other products">
        <div className="uc-wrap">
          <h2>Products</h2>
          <ul>
            {productCards.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={item.href === page.href ? "is-current" : undefined}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </article>
  );
}

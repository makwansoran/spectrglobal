import Link from "next/link";
import { offerings, offeringsPage } from "@/lib/offerings";
import "./offerings-page.css";

export function OfferingsPageView() {
  return (
    <main id="main-content" className="offerings-page">
      <section className="offerings-page__intro" aria-labelledby="offerings-heading">
        <div className="offerings-page__intro-inner">
          <h1 id="offerings-heading" className="offerings-page__title">
            {offeringsPage.title}
          </h1>
          <p className="offerings-page__lede">{offeringsPage.body}</p>
        </div>
      </section>

      <section className="offerings-page__list" aria-label="All offerings">
        <ul>
          {offerings.map((item) => (
            <li key={item.href + item.title}>
              <Link href={item.href} className="offerings-page__row">
                <span className="offerings-page__name">
                  <span aria-hidden="true">↳ </span>
                  {item.title}
                </span>
                <span className="offerings-page__body">{item.body}</span>
                <span className="offerings-page__more">Learn More</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

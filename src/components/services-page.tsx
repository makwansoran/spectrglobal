import Image from "next/image";
import { ServicesGlobe } from "@/components/services-globe";
import { services, servicesPage } from "@/lib/services";
import "./offerings-page.css";
import "./services-page.css";

export function ServicesPageView() {
  return (
    <main id="main-content" className="offerings-page">
      <section className="offerings-page__intro" aria-labelledby="services-heading">
        <div className="offerings-page__intro-inner">
          <h1 id="services-heading" className="offerings-page__title">
            {servicesPage.title}
          </h1>
          <p className="offerings-page__lede">{servicesPage.body}</p>
        </div>
      </section>

      <section className="services-page__media" aria-label="How we work">
        <div className="services-page__media-grid">
          <ServicesGlobe />
          <div className="services-page__photo">
            <Image
              src={servicesPage.productionImage}
              alt={servicesPage.productionImageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className="services-page__photo-image"
              priority
            />
          </div>
        </div>
      </section>

      <section className="offerings-page__list" aria-label="Engagement steps">
        <ul>
          {services.map((item) => (
            <li key={item.title}>
              <div className="offerings-page__row">
                <span className="offerings-page__name">
                  <span aria-hidden="true">↳ </span>
                  {item.title}
                </span>
                <span className="offerings-page__body">{item.body}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

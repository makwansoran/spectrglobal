import Image from "next/image";
import { ServicesGlobe } from "@/components/services-globe";
import { services, servicesPage } from "@/lib/services";
import "./offerings-page.css";
import "./services-page.css";

export function ServicesPageView() {
  return (
    <main id="main-content" className="offerings-page">
      <section className="services-page__hero" aria-labelledby="services-heading">
        <ServicesGlobe />
        <div className="services-page__hero-inner">
          <h1 id="services-heading" className="offerings-page__title">
            {servicesPage.title}
          </h1>
        </div>
      </section>

      <section className="services-page__media" aria-label="How we work">
        <div className="services-page__media-grid">
          <div className="services-page__photo">
            <Image
              src={servicesPage.productionImage}
              alt={servicesPage.productionImageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 55vw"
              className="services-page__photo-image"
              priority
            />
          </div>
          <p className="services-page__lede">{servicesPage.body}</p>
        </div>
      </section>

      <section className="offerings-page__list services-page__steps" aria-label="Engagement steps">
        <ul>
          {services.map((item) => (
            <li key={item.title}>
              <div className="services-page__step">
                <div className="services-page__step-copy">
                  <h2 className="offerings-page__name">
                    <span aria-hidden="true">↳ </span>
                    {item.title}
                  </h2>
                  <p className="offerings-page__body">{item.body}</p>
                </div>
                <div className="services-page__step-media">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 900px) 100vw, 28rem"
                    className="services-page__step-image"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

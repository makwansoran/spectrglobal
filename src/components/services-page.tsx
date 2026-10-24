import { services, servicesPage } from "@/lib/services";
import "./offerings-page.css";

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

      <section className="offerings-page__list" aria-label="All services">
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

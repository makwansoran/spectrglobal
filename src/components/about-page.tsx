import Image from "next/image";
import { aboutPage } from "@/lib/about";
import "./about-page.css";

export function AboutPageView() {
  const content = aboutPage;
  const { founder, office } = content;

  return (
    <main id="main-content" className="about-page">
      <section className="about-page__hero" aria-labelledby="about-heading">
        <div className="about-page__hero-inner">
          <h1 id="about-heading" className="about-page__title home-display">
            {content.title}
          </h1>
          <p className="about-page__belief">{content.belief}</p>
        </div>
      </section>

      <div className="about-page__content">
        <section className="about-page__statement" aria-label="About Spectr">
          <p className="about-page__lead">{content.statement}</p>
          <div className="about-page__body">
            {content.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="about-page__founder" aria-labelledby="founder-heading">
          <div className="about-page__founder-media">
            <Image
              src={founder.image}
              alt={founder.imageAlt}
              fill
              sizes="(max-width: 700px) 100vw, 16rem"
              className="about-page__founder-image"
            />
          </div>
          <div className="about-page__founder-copy">
            <p className="about-page__founder-kicker">{founder.role}</p>
            <h2 id="founder-heading">{founder.name}</h2>
            <ul className="about-page__contact-list">
              <li>
                <a href={`mailto:${founder.email}`}>{founder.email}</a>
              </li>
              <li>
                <a href={founder.phoneHref}>{founder.phone}</a>
              </li>
            </ul>
            <div className="about-page__office">
              <p className="about-page__founder-kicker">{office.label}</p>
              <p className="about-page__office-place">{office.place}</p>
              <p className="about-page__office-address">{office.address}</p>
            </div>
          </div>
        </section>

        <section className="about-page__map-block" aria-label={office.mapTitle}>
          <div className="about-page__map">
            <iframe
              title={office.mapTitle}
              src={office.mapEmbedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <a
            href={office.mapLink}
            className="about-page__map-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open map
            <span aria-hidden="true"> →</span>
          </a>
        </section>
      </div>
    </main>
  );
}

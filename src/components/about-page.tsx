import Image from "next/image";
import { aboutPage } from "@/lib/about";
import "./about-page.css";

export function AboutPageView() {
  const content = aboutPage;

  return (
    <main id="main-content" className="about-page">
      <section className="about-page__hero" aria-labelledby="about-heading">
        <div className="about-page__hero-inner">
          <h1 id="about-heading" className="about-page__title">
            {content.title}
          </h1>
          <p className="about-page__belief">{content.belief}</p>
        </div>
        <div className="about-page__media">
          <Image
            src={content.heroImage}
            alt={content.heroImageAlt}
            width={2400}
            height={1200}
            priority
            sizes="100vw"
          />
        </div>
      </section>

      <section className="about-page__statement" aria-label="About Spectr">
        <h2>{content.statement}</h2>
      </section>

      <div className="about-page__essay">
        {content.founding.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <section className="about-page__section" aria-labelledby="what-we-do-heading">
        <h2 id="what-we-do-heading" className="about-page__section-title">
          {content.whatWeDoTitle}
        </h2>
        <div className="about-page__blocks">
          {content.whatWeDo.map((block) => (
            <article key={block.title} className="about-page__block">
              <h3>{block.title}</h3>
              {block.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>
      </section>

      <section className="about-page__section" aria-labelledby="expertise-heading">
        <h2 id="expertise-heading" className="about-page__section-title">
          {content.expertiseTitle}
        </h2>
        <div className="about-page__expertise">
          {content.expertise.map((item) => (
            <article key={item.title} className="about-page__expertise-item">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-page__section" aria-labelledby="started-heading">
        <h2 id="started-heading" className="about-page__section-title">
          {content.startedTitle}
        </h2>
        <div className="about-page__prose">
          {content.started.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="about-page__section" aria-labelledby="future-heading">
        <h2 id="future-heading" className="about-page__section-title">
          {content.futureTitle}
        </h2>
        <p className="about-page__future-lead">{content.futureLead}</p>
        <div className="about-page__prose">
          {content.future.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <div className="about-page__footer-space" aria-hidden="true" />
    </main>
  );
}

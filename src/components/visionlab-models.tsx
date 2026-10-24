import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { visionlabPage } from "@/lib/visionlab-page";
import { visionlabProviders } from "@/lib/visionlab-models";
import "./visionlab-models.css";

export function VisionlabModelsCatalog() {
  const page = visionlabPage;
  const loop = [...visionlabProviders, ...visionlabProviders];

  return (
    <section className="visionlab-models-section" aria-labelledby="visionlab-models-title">
      <div className="product-wrap">
        <Reveal className="visionlab-models-head">
          <h2 id="visionlab-models-title">{page.modelsTitle}</h2>
          <p>{page.modelsBody}</p>
          <p className="visionlab-models-note">{page.modelsNote}</p>
        </Reveal>
      </div>

      <div className="visionlab-marquee" aria-label="Model providers">
        <div className="visionlab-marquee__fade visionlab-marquee__fade--left" aria-hidden="true" />
        <div className="visionlab-marquee__fade visionlab-marquee__fade--right" aria-hidden="true" />
        <div className="visionlab-marquee__track">
          {loop.map((provider, index) => (
            <div
              key={`${provider.id}-${index}`}
              className="visionlab-marquee__item"
              aria-hidden={index >= visionlabProviders.length ? true : undefined}
            >
              <Image
                src={provider.logo}
                alt=""
                width={56}
                height={56}
                className="visionlab-marquee__logo"
              />
              <span className="visionlab-marquee__name">{provider.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="product-wrap">
        <p className="visionlab-models-hosting">
          <Image
            src={page.modelsHostingLogo}
            alt="AWS"
            width={72}
            height={44}
            className="visionlab-models-hosting__logo"
          />
          <span>{page.modelsHosting}</span>
        </p>
      </div>
    </section>
  );
}

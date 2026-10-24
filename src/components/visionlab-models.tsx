import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { visionlabPage } from "@/lib/visionlab-page";
import {
  visionlabModels,
  visionlabProviders,
  type VisionlabProviderId,
} from "@/lib/visionlab-models";
import "./visionlab-models.css";

const providerOrder = Array.from(
  new Set(visionlabModels.map((model) => model.providerId)),
) as VisionlabProviderId[];

export function VisionlabModelsCatalog() {
  const page = visionlabPage;

  return (
    <section className="visionlab-models-section" aria-labelledby="visionlab-models-title">
      <div className="product-wrap">
        <Reveal className="visionlab-models-head">
          <h2 id="visionlab-models-title">{page.modelsTitle}</h2>
          <p>{page.modelsBody}</p>
          <p className="visionlab-models-note">{page.modelsNote}</p>
        </Reveal>

        <ul className="visionlab-models-providers" aria-label="Model providers">
          {providerOrder.map((id) => {
            const provider = visionlabProviders[id];
            return (
              <li key={id}>
                <Image src={provider.logo} alt="" width={22} height={22} />
                <span>{provider.name}</span>
              </li>
            );
          })}
        </ul>

        <ul className="visionlab-models-grid">
          {visionlabModels.map((model) => {
            const provider = visionlabProviders[model.providerId];
            return (
              <li key={`${model.provider}-${model.name}`}>
                <article className="visionlab-model-card">
                  <div className="visionlab-model-card__top">
                    <Image
                      src={provider.logo}
                      alt=""
                      width={38}
                      height={38}
                      className="visionlab-model-card__logo"
                    />
                    <div className="visionlab-model-card__copy">
                      <p className="visionlab-model-card__provider">{model.provider}</p>
                      <h3 className="visionlab-model-card__name">{model.name}</h3>
                    </div>
                  </div>
                  <p className="visionlab-model-card__meta">
                    <span className="visionlab-model-card__task">{model.task}</span>
                    <span>
                      {model.provider} · {model.task}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{model.size}</span>
                  </p>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

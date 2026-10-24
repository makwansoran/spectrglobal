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

        <ul className="visionlab-models-showcase" aria-label="Model providers">
          {providerOrder.map((id) => {
            const provider = visionlabProviders[id];
            return (
              <li key={id}>
                <article className="visionlab-provider-card">
                  <Image
                    src={provider.logo}
                    alt=""
                    width={48}
                    height={48}
                    className="visionlab-provider-card__logo"
                  />
                  <h3 className="visionlab-provider-card__name">{provider.name}</h3>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

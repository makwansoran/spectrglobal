import Image from "next/image";
import { BootcampVideo } from "@/components/sections/bootcamp-video";
import { spectrBootcamp } from "@/lib/content";
import "./spectr-bootcamp.css";

export function SpectrBootcamp() {
  return (
    <section id="bootcamp" className="bootcamp" aria-labelledby="bootcamp-heading">
      <div className="bootcamp__inner">
        <p className="bootcamp__eyebrow">{spectrBootcamp.eyebrow}</p>
        <div className="bootcamp__intro">
          <div>
            <h1 id="bootcamp-heading" className="bootcamp__title">
              {spectrBootcamp.title}
            </h1>
            <p className="bootcamp__body">{spectrBootcamp.body}</p>
          </div>
          <p className="bootcamp__badge">{spectrBootcamp.courseLabel}</p>
        </div>

        <BootcampVideo src={spectrBootcamp.videoSrc} title={spectrBootcamp.videoTitle} />

        <div className="bootcamp__plan">
          <p className="bootcamp__plan-eyebrow">{spectrBootcamp.planEyebrow}</p>
          <h2 className="bootcamp__plan-title">{spectrBootcamp.planTitle}</h2>
        </div>

        <ol className="bootcamp__steps">
          {spectrBootcamp.steps.map((step) => (
            <li key={step.index} className="bootcamp__step">
              <div className="bootcamp__step-image">
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80vw, 20vw"
                  quality={90}
                />
              </div>
              <p className="bootcamp__step-index">{step.index}</p>
              <h3 className="bootcamp__step-title">{step.title}</h3>
              <p className="bootcamp__step-body">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

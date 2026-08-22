import { ArrowIcon, Button } from "@/components/button";
import { BootcampVideo } from "@/components/sections/bootcamp-video";
import { spectrBootcamp } from "@/lib/content";
import "./spectr-bootcamp.css";

type SpectrBootcampProps = {
  signedIn: boolean;
};

export function SpectrBootcamp({ signedIn }: SpectrBootcampProps) {
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

        {signedIn ? (
          <BootcampVideo src={spectrBootcamp.videoSrc} title={spectrBootcamp.videoTitle} />
        ) : (
          <div className="bootcamp-gate">
            <p className="bootcamp-gate__eyebrow">Members only</p>
            <h2 className="bootcamp-gate__title">{spectrBootcamp.attendTitle}</h2>
            <p className="bootcamp-gate__body">{spectrBootcamp.attendBody}</p>
            <div className="bootcamp-gate__actions">
              <Button href={`/login?next=${encodeURIComponent(spectrBootcamp.href)}`}>
                {spectrBootcamp.attendCta}
                <ArrowIcon />
              </Button>
              <Button
                href={`/signup?next=${encodeURIComponent(spectrBootcamp.href)}`}
                variant="secondary"
              >
                {spectrBootcamp.attendSignup}
              </Button>
            </div>
          </div>
        )}

        <div className="bootcamp__plan">
          <p className="bootcamp__plan-eyebrow">{spectrBootcamp.planEyebrow}</p>
          <h2 className="bootcamp__plan-title">{spectrBootcamp.planTitle}</h2>
        </div>

        <ol className="bootcamp__steps">
          {spectrBootcamp.steps.map((step) => (
            <li key={step.index} className="bootcamp__step">
              <div
                className="bootcamp__step-image"
                role="img"
                aria-label={step.imageAlt}
              >
                <span className="bootcamp__step-image-mark" aria-hidden="true">
                  Image
                </span>
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

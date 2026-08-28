import Link from "next/link";
import "./waitlist-section.css";

export function EdgeCompute() {
  return (
    <section
      id="spectr-edge"
      className="bg-white px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8"
      aria-labelledby="spectr-edge-heading"
    >
      <div className="mx-auto grid w-full max-w-[1400px] items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="spectros-waitlist__intro min-w-0 lg:self-center">
          <h2 id="spectr-edge-heading" className="home-display spectros-waitlist__headline">
            <span className="spectros-waitlist__line">
              <span className="spectros-waitlist__word" data-i="1">
                <span>Spectr</span>
              </span>
              <span className="spectros-waitlist__word" data-i="2">
                <span>Edge</span>
              </span>
            </span>
          </h2>
          <p className="spectros-waitlist__lede spectros-waitlist__lede--product mx-auto mt-6 text-center">
            The computer for industrial AI. Run models on site, not in someone else&apos;s cloud.
          </p>
        </div>

        <div className="spectros-waitlist__panel min-w-0" aria-label="Spectr Edge computer photo">
          <div className="spectros-waitlist__scrim" aria-hidden="true" />
          <div className="spectros-waitlist__content">
            <h3 className="home-display spectros-waitlist__title">
              On-site compute
              <br />
              for the floor
            </h3>
            <div className="spectros-waitlist__cta">
              <Link href="/waitlist" className="spectros-waitlist__join spectros-waitlist__join--on-media">
                Join waitlist
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

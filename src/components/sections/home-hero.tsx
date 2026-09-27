import { LogoMark } from "@/components/logo";
import "./home-hero.css";

export function HomeHero() {
  return (
    <section
      id="spectros"
      className="home-hero"
      aria-labelledby="industry-preview-title"
    >
      <div className="home-hero__center">
        <div className="spectros-waitlist__intro min-w-0">
          <h1 id="industry-preview-title" className="home-display spectros-waitlist__headline">
            <span className="spectros-waitlist__line">
              <span className="spectros-waitlist__word" data-i="1">
                <span>AI</span>
              </span>
              <span className="spectros-waitlist__word" data-i="2">
                <span>system</span>
              </span>
            </span>
            <span className="spectros-waitlist__line">
              <span className="spectros-waitlist__word" data-i="3">
                <span>for</span>
              </span>
              <span className="spectros-waitlist__word" data-i="4">
                <span>materials</span>
              </span>
            </span>
          </h1>
          <p className="spectros-waitlist__logo">
            <LogoMark className="spectros-waitlist__logo-mark" title="" />
            Spectr
          </p>
        </div>
      </div>
    </section>
  );
}

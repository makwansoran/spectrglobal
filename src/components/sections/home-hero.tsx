import { LogoMark } from "@/components/logo";
import "./home-hero.css";

export function HomeHero() {
  return (
    <section
      id="spectros"
      className="bg-white px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16"
      aria-labelledby="industry-preview-title"
    >
      <div className="mx-auto flex w-full max-w-[1400px] justify-center">
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

import { aboutPage } from "@/lib/about";
import "./vision-home.css";

export function VisionHome() {
  return (
    <div className="vision">
      <section className="vision-landing" aria-labelledby="landing-title">
        <h1 id="landing-title">Eyes of Compute</h1>
        <p>{aboutPage.belief}</p>
      </section>

      <section className="vision-about" aria-labelledby="about-title">
        <h2 id="about-title">About us</h2>
        <p>{aboutPage.statement}</p>
        {aboutPage.founding.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
    </div>
  );
}

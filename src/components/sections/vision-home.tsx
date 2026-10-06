"use client";

import Image from "next/image";
import { aboutPage } from "@/lib/about";
import { useGetStarted } from "@/components/get-started-context";
import "./vision-home.css";

function downloadVisionLab() {
  window.location.assign("/visionlab");
}

export function VisionHome() {
  const { openGetStarted } = useGetStarted();

  return (
    <div className="vision">
      <section className="vision-landing" aria-labelledby="landing-title">
        <h1 id="landing-title">Eyes of Compute</h1>
        <p>{aboutPage.belief}</p>
      </section>

      <section className="vision-about" aria-labelledby="about-title">
        <h2 id="about-title">About us</h2>
        <div className="vision-about__media">
          <Image
            src="/argusone.jpg"
            alt="ArgusONE marking people, a bicycle, and handbags on a cobbled square"
            width={1024}
            height={682}
          />
        </div>
        <div className="vision-about__copy">
          <p>{aboutPage.statement}</p>
          {aboutPage.founding.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="vision-close" aria-label="Get started">
        <div className="vision-close__row">
          <button type="button" className="vision-close__action vision-close__action--light" onClick={downloadVisionLab}>
            <span>Try VisionLab</span>
            <span aria-hidden="true">→</span>
          </button>
          <button type="button" className="vision-close__action vision-close__action--dark" onClick={() => openGetStarted("contact")}>
            <span>Get in touch</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useGetStarted } from "@/components/get-started-context";
import { models, solutions, faqs } from "@/lib/vision";
import "./vision-home.css";

function downloadVisionLab() {
  window.location.assign("/visionlab");
}

function CopyInstall({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="vision-install">
      <code>{command}</code>
      <button type="button" onClick={copy}>
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export function VisionHome() {
  const { openGetStarted } = useGetStarted();
  const [openSolutions, setOpenSolutions] = useState<Record<string, boolean>>({});
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  function toggleSolution(title: string) {
    setOpenSolutions((current) => ({ ...current, [title]: !current[title] }));
  }

  return (
    <div className="vision">
      <section className="vision-hero" aria-labelledby="vision-hero-title">
        <div className="vision-hero__media">
          <Image
            src="/spectr-detection.png"
            alt="Aerial site with vehicles outlined by Spectr detection"
            fill
            priority
            sizes="100vw"
            className="vision-hero__image"
          />
          <div className="vision-hero__shade" />
        </div>
        <div className="vision-hero__copy">
          <h1 id="vision-hero-title">The Eyes of Automation</h1>
          <div className="vision-hero__actions">
            <a className="vision-btn vision-btn--solid" href="#models">
              Explore models
            </a>
          </div>
        </div>
      </section>

      <section className="vision-section" id="models" aria-labelledby="models-title">
        <ul className="vision-models">
          {models.map((model) => (
            <li key={model.name}>
              {model.name === "ArgusONE" ? (
                <h2 id="models-title" className="vision-models__title">
                  {model.name}
                </h2>
              ) : (
                <p className="vision-models__title">{model.name}</p>
              )}
              <article>
                <p>{model.body}</p>
                <div className="vision-models__media">
                  <Image
                    src={model.image}
                    alt={model.imageAlt}
                    width={model.imageWidth}
                    height={model.imageHeight}
                  />
                </div>
                {"install" in model ? (
                  <>
                    <CopyInstall command={model.install} />
                    <Link href="/developers" className="vision-text-link">
                      Learn more
                    </Link>
                  </>
                ) : (
                  <div className="vision-download-stack">
                    <button type="button" className="vision-download" onClick={downloadVisionLab}>
                      Download
                    </button>
                    <Link href="/developers" className="vision-text-link">
                      Learn more
                    </Link>
                  </div>
                )}
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="vision-section" aria-labelledby="zivid-title">
        <div className="vision-zivid">
          <div className="vision-zivid__copy">
            <h2 id="zivid-title">VisionLab With Zivid Cameras</h2>
            <p>
              A Zivid camera sees the cell in color and in depth from one mount. VisionLab opens that live stream, runs ArgusONE on each frame, and keeps the track on the machine beside the camera.
            </p>
            <p>
              The marks and the 3D points stay together. A robot or an operator can act on what the camera just saw without sending the scene off the line.
            </p>
          </div>
          <div className="vision-zivid__stage" role="img" aria-label="Real-time VisionLab video coming soon">
            <span className="vision-zivid__play" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="vision-section vision-section--tiles" id="solutions" aria-label="Solutions">
        <ul className="vision-tiles">
          {solutions.map((item) => {
            const open = Boolean(openSolutions[item.title]);
            return (
              <li key={item.title}>
                <article className={`vision-tile vision-tile--${item.tone}${open ? " is-open" : ""}`}>
                  <button
                    type="button"
                    className="vision-tile__hit"
                    aria-expanded={open}
                    aria-label={`${open ? "Collapse" : "Expand"}: ${item.title}`}
                    onClick={() => toggleSolution(item.title)}
                  />
                  <p className="vision-tile__label">{item.label}</p>
                  <h3>{item.title}</h3>
                  <div className="vision-tile__slide">
                    <div className="vision-tile__face">
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw"
                      />
                      <span className="vision-tile__expand" aria-hidden="true">
                        Expand ›
                      </span>
                    </div>
                    <div className="vision-tile__face vision-tile__face--copy">
                      <p>{item.body}</p>
                      <span className="vision-tile__expand" aria-hidden="true">
                        Collapse ›
                      </span>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="vision-questions" aria-labelledby="faq-title">
        <div className="vision-questions__inner">
          <h2 id="faq-title">Questions</h2>
          <ul>
            {faqs.map((item, index) => {
              const open = openQuestion === item.question;
              return (
                <li key={item.question} className={open ? "is-open" : undefined}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`question-${index}`}
                      onClick={() => setOpenQuestion(open ? null : item.question)}
                    >
                      {item.question}
                    </button>
                  </h3>
                  <p id={`question-${index}`}>{item.answer}</p>
                  <span className="vision-questions__index" aria-hidden="true">
                    /0.{index + 1}
                  </span>
                </li>
              );
            })}
          </ul>
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
        <p className="vision-close__legal">
          <Link href="/privacy">Privacy policy</Link>
          <Link href="/terms">Terms of service</Link>
        </p>
      </section>
    </div>
  );
}

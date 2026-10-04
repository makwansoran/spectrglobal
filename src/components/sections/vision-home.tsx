"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useGetStarted } from "@/components/get-started-context";
import { downloads } from "@/lib/site";
import { models, solutions, faqs } from "@/lib/vision";
import "./vision-home.css";

function downloadVisionLab() {
  const ua = navigator.userAgent;
  const href = /Mac/i.test(ua)
    ? downloads.mac
    : /Linux/i.test(ua) && !/Android/i.test(ua)
      ? downloads.linux
      : downloads.windows;
  window.location.assign(href);
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
          <h1 id="vision-hero-title">Open models for seeing and acting in the world.</h1>
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
              {model.task === "Models" ? (
                <h2 id="models-title" className="vision-models__title">
                  {model.task}
                </h2>
              ) : (
                <p className="vision-models__title">{model.task}</p>
              )}
              <article>
                <h3>{model.name}</h3>
                <p>{model.body}</p>
                {"image" in model ? (
                  <div className="vision-models__media">
                    <Image src={model.image} alt={model.imageAlt} width={1024} height={682} />
                  </div>
                ) : (
                  <div className="vision-models__media">
                    <div className="vision-models__placeholder" role="img" aria-label="VisionLab image coming soon" />
                  </div>
                )}
                {"install" in model ? (
                  <>
                    <CopyInstall command={model.install} />
                    <Link href="/developers" className="vision-text-link">
                      Learn more
                    </Link>
                  </>
                ) : (
                  <button type="button" className="vision-download" onClick={downloadVisionLab}>
                    Download
                  </button>
                )}
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="vision-section" id="solutions" aria-labelledby="solutions-title">
        <div className="vision-section__head">
          <h2 id="solutions-title">Vision AI across the work that moves</h2>
          <p>Spectr models see factories, yards, roads, clinics, and fields — then hand the next action to a person or a machine.</p>
        </div>
        <ul className="vision-solutions">
          {solutions.map((item) => (
            <li key={item.title}>
              <article>
                <div className="vision-solutions__media">
                  <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 700px) 100vw, 360px" />
                </div>
                <div className="vision-solutions__copy">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="vision-section" aria-labelledby="faq-title">
        <div className="vision-section__head">
          <h2 id="faq-title">Questions</h2>
        </div>
        <div className="vision-faq">
          {faqs.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="vision-close" aria-labelledby="close-title">
        <h2 id="close-title">Your scene, in the open.</h2>
        <p>Start with a public Spectr model. Train it on your data when the world looks different from the demo.</p>
        <button type="button" className="vision-btn vision-btn--solid" onClick={() => openGetStarted("contact")}>
          Talk to Spectr
        </button>
      </section>
    </div>
  );
}

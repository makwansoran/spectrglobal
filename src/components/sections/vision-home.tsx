"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useGetStarted } from "@/components/get-started-context";
import { models, solutions, tasks, faqs } from "@/lib/vision";
import "./vision-home.css";

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
            <button type="button" className="vision-btn vision-btn--ghost" onClick={() => openGetStarted("contact")}>
              Get started
            </button>
          </div>
        </div>
      </section>

      <section className="vision-section" id="models" aria-labelledby="models-title">
        <div className="vision-section__head">
          <h2 id="models-title">Models</h2>
        </div>
        <ul className="vision-models">
          {models.map((model) => (
            <li key={model.name}>
              <article>
                <p className="vision-models__task">{model.task}</p>
                <h3>{model.name}</h3>
                <p>{model.body}</p>
                <CopyInstall command={model.install} />
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="vision-section vision-section--tight" aria-labelledby="tasks-title">
        <div className="vision-section__head">
          <h2 id="tasks-title">One stack. Every vision task.</h2>
        </div>
        <ul className="vision-tasks">
          {tasks.map((task) => (
            <li key={task.title}>
              <h3>{task.title}</h3>
              <p>{task.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="vision-section" aria-labelledby="lifecycle-title">
        <div className="vision-section__head">
          <h2 id="lifecycle-title">From a frame to an action</h2>
          <p>Label what matters, train on your own scenes, and run the model next to the camera.</p>
        </div>
        <div className="vision-split">
          <div className="vision-split__media">
            <Image
              src="/images/industries/manufacturing.jpg"
              alt="Manufacturing line where vision models inspect parts"
              fill
              sizes="(max-width: 860px) 100vw, 520px"
            />
          </div>
          <ol className="vision-steps">
            <li>
              <h3>Label</h3>
              <p>Boxes, polygons, masks, and keypoints. Start from a Spectr model, then correct the misses.</p>
            </li>
            <li>
              <h3>Train</h3>
              <p>Fine-tune open weights on your site, your parts, and your lighting. Keep the dataset with you.</p>
            </li>
            <li>
              <h3>Deploy</h3>
              <p>Export to the runtimes you already use and put inference on the line, the vehicle, or the robot.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="vision-section" aria-labelledby="code-title">
        <div className="vision-code">
          <div>
            <h2 id="code-title">Built for developers. Ready for production.</h2>
            <p>
              The same open models behind the examples are the models you ship. Install the
              library, load a checkpoint, and predict.
            </p>
            <Link href="/developers" className="vision-text-link">
              Read the docs
            </Link>
          </div>
          <pre>
            <code>{`pip install spectr

from spectr import Spectr

model = Spectr("spectr-detect")
results = model.predict("site.jpg")
results.save()`}</code>
          </pre>
        </div>
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

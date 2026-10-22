"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  argusCompareMetrics,
  argusCompareModels,
  type ArgusCompareModelId,
} from "@/lib/argus-page";

export function ArgusCompareChart() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setActive(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`argus-compare${active ? " is-active" : ""}`}>
      {argusCompareMetrics.map((metric, metricIndex) => (
        <div key={metric.id} className="argus-compare__metric" style={{ "--i": metricIndex } as CSSProperties}>
          <h3 className="argus-compare__metric-label">{metric.label}</h3>
          <ul className="argus-compare__bars" aria-label={metric.label}>
            {argusCompareModels.map((model, modelIndex) => {
              const score = metric.scores[model.id as ArgusCompareModelId];
              return (
                <li
                  key={model.id}
                  className={`argus-compare__row${model.highlight ? " is-highlight" : ""}`}
                  style={{ "--j": modelIndex } as CSSProperties}
                >
                  <span className="argus-compare__name">{model.name}</span>
                  <div className="argus-compare__track" role="presentation">
                    <span
                      className="argus-compare__fill"
                      style={{ "--score": score } as CSSProperties}
                    />
                  </div>
                  <span className="argus-compare__score">{score}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

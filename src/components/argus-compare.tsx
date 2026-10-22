"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import {
  argusCompareMetrics,
  argusCompareModels,
  type ArgusCompareModelId,
} from "@/lib/argus-page";

const MODEL_FILL: Record<ArgusCompareModelId, string> = {
  argus: "#1e1f2b",
  yolo: "#5c5c62",
  detectron2: "#7a7a80",
  "grounding-dino": "#9a9aa0",
  sam2: "#b8b8bc",
  cloud: "#d4d4d6",
};

const AXIS_SHORT: Record<string, string> = {
  edge: "Edge",
  track: "Tracking",
  finetune: "Fine-tune",
  camera: "Camera",
  nocloud: "Local",
};

const WIDTH = 560;
const HEIGHT = 320;
const PAD = { top: 16, right: 12, bottom: 42, left: 36 };
const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;

export function ArgusCompareChart() {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [active, setActive] = useState(false);
  const [focus, setFocus] = useState<ArgusCompareModelId | null>(null);

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

  const groupCount = argusCompareMetrics.length;
  const barCount = argusCompareModels.length;
  const groupWidth = PLOT_W / groupCount;
  const innerPad = groupWidth * 0.14;
  const barGap = 2;
  const barWidth = (groupWidth - innerPad * 2 - barGap * (barCount - 1)) / barCount;

  const yTicks = [0, 25, 50, 75, 100];

  return (
    <div ref={ref} className={`argus-compare${active ? " is-active" : ""}`}>
      <svg
        className="argus-compare__svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-labelledby={`${titleId}-title ${titleId}-desc`}
      >
        <title id={`${titleId}-title`}>Argus compared to other vision models</title>
        <desc id={`${titleId}-desc`}>
          Grouped bar chart of industrial deployment scores across edge inference, tracking,
          fine-tune, camera path, and local-only deployment for Argus, YOLO, Detectron2, Grounding
          DINO, SAM 2, and cloud vision APIs.
        </desc>

        {yTicks.map((tick) => {
          const y = PAD.top + PLOT_H * (1 - tick / 100);
          return (
            <g key={tick}>
              <line
                className="argus-compare__grid"
                x1={PAD.left}
                y1={y}
                x2={PAD.left + PLOT_W}
                y2={y}
              />
              <text className="argus-compare__tick" x={PAD.left - 8} y={y} textAnchor="end" dominantBaseline="middle">
                {tick}
              </text>
            </g>
          );
        })}

        {argusCompareMetrics.map((metric, groupIndex) => {
          const groupX = PAD.left + groupIndex * groupWidth;
          return (
            <g key={metric.id}>
              <text
                className="argus-compare__axis-label"
                x={groupX + groupWidth / 2}
                y={HEIGHT - 14}
                textAnchor="middle"
              >
                {AXIS_SHORT[metric.id] ?? metric.label}
              </text>
              {argusCompareModels.map((model, barIndex) => {
                const id = model.id as ArgusCompareModelId;
                const score = metric.scores[id];
                const x = groupX + innerPad + barIndex * (barWidth + barGap);
                const barH = (score / 100) * PLOT_H;
                const y = PAD.top + PLOT_H - barH;
                const dimmed = focus !== null && focus !== id;
                return (
                  <rect
                    key={model.id}
                    className={`argus-compare__bar${model.highlight ? " is-highlight" : ""}${dimmed ? " is-dim" : ""}`}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barH}
                    rx={1.5}
                    fill={MODEL_FILL[id]}
                    style={{ "--i": groupIndex * barCount + barIndex } as CSSProperties}
                  >
                    <title>{`${model.name} · ${metric.label}: ${score}`}</title>
                  </rect>
                );
              })}
            </g>
          );
        })}
      </svg>

      <ul className="argus-compare__legend" aria-label="Models">
        {argusCompareModels.map((model) => {
          const id = model.id as ArgusCompareModelId;
          return (
            <li key={model.id}>
              <button
                type="button"
                className={`argus-compare__legend-btn${model.highlight ? " is-highlight" : ""}${focus === id ? " is-focus" : ""}`}
                onMouseEnter={() => setFocus(id)}
                onMouseLeave={() => setFocus(null)}
                onFocus={() => setFocus(id)}
                onBlur={() => setFocus(null)}
              >
                <span className="argus-compare__swatch" style={{ background: MODEL_FILL[id] }} aria-hidden="true" />
                {model.name}
              </button>
            </li>
          );
        })}
      </ul>

      <table className="argus-compare__table sr-only">
        <caption>Industrial deployment scores by model</caption>
        <thead>
          <tr>
            <th scope="col">Model</th>
            {argusCompareMetrics.map((metric) => (
              <th key={metric.id} scope="col">
                {metric.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {argusCompareModels.map((model) => (
            <tr key={model.id}>
              <th scope="row">{model.name}</th>
              {argusCompareMetrics.map((metric) => (
                <td key={metric.id}>{metric.scores[model.id as ArgusCompareModelId]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

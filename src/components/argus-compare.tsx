"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  argusCompareMetrics,
  argusCompareModels,
  type ArgusCompareModelId,
} from "@/lib/argus-page";

const SIZE = 420;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADIUS = 148;

const MODEL_STROKE: Record<ArgusCompareModelId, string> = {
  argus: "#1e1f2b",
  yolo: "#5c5c62",
  detectron2: "#7a7a80",
  "grounding-dino": "#9a9aa0",
  sam2: "#b4b4b8",
  cloud: "#cbcbcf",
};

const AXIS_SHORT: Record<string, string> = {
  edge: "Edge",
  track: "Tracking",
  finetune: "Fine-tune",
  camera: "Camera path",
  nocloud: "No cloud",
};

function polar(angle: number, radius: number) {
  return {
    x: CX + radius * Math.cos(angle),
    y: CY + radius * Math.sin(angle),
  };
}

function axisAngle(index: number, total: number) {
  return -Math.PI / 2 + (index / total) * Math.PI * 2;
}

export function ArgusCompareChart() {
  const ref = useRef<HTMLDivElement>(null);
  const gradId = useId();
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

  const axes = useMemo(() => {
    const total = argusCompareMetrics.length;
    return argusCompareMetrics.map((metric, index) => {
      const angle = axisAngle(index, total);
      const tip = polar(angle, RADIUS);
      const label = polar(angle, RADIUS + 28);
      return { metric, angle, tip, label };
    });
  }, []);

  const rings = [0.25, 0.5, 0.75, 1];

  const series = useMemo(() => {
    const total = argusCompareMetrics.length;
    return argusCompareModels.map((model) => {
      const points = argusCompareMetrics.map((metric, index) => {
        const score = metric.scores[model.id as ArgusCompareModelId];
        const angle = axisAngle(index, total);
        return polar(angle, (score / 100) * RADIUS);
      });
      const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";
      return { model, points, path };
    });
  }, []);

  return (
    <div ref={ref} className={`argus-compare${active ? " is-active" : ""}`}>
      <div className="argus-compare__graph">
        <svg
          className="argus-compare__svg"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-labelledby={`${gradId}-title ${gradId}-desc`}
        >
          <title id={`${gradId}-title`}>Argus compared to other vision models</title>
          <desc id={`${gradId}-desc`}>
            Radar chart of industrial deployment scores across edge inference, tracking, fine-tune,
            camera path, and no cloud dependency for Argus, YOLO, Detectron2, Grounding DINO, SAM 2,
            and cloud vision APIs.
          </desc>

          {rings.map((scale) => (
            <polygon
              key={scale}
              className="argus-compare__ring"
              points={axes
                .map(({ angle }) => {
                  const p = polar(angle, RADIUS * scale);
                  return `${p.x},${p.y}`;
                })
                .join(" ")}
            />
          ))}

          {axes.map(({ tip, label, metric }) => (
            <g key={metric.id}>
              <line className="argus-compare__axis" x1={CX} y1={CY} x2={tip.x} y2={tip.y} />
              <text
                className="argus-compare__axis-label"
                x={label.x}
                y={label.y}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {AXIS_SHORT[metric.id] ?? metric.label}
              </text>
            </g>
          ))}

          {series.map(({ model, path }) => {
            const id = model.id as ArgusCompareModelId;
            const dimmed = focus !== null && focus !== id;
            const emphasized = model.highlight || focus === id;
            return (
              <path
                key={model.id}
                className={`argus-compare__series${model.highlight ? " is-highlight" : ""}${dimmed ? " is-dim" : ""}`}
                d={path}
                fill={model.highlight ? `url(#${gradId}-fill)` : "none"}
                stroke={MODEL_STROKE[id]}
                strokeWidth={emphasized ? 2.75 : 1.5}
              />
            );
          })}

          <defs>
            <radialGradient id={`${gradId}-fill`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e1f2b" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#1e1f2b" stopOpacity="0.04" />
            </radialGradient>
          </defs>
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
                  <span
                    className="argus-compare__swatch"
                    style={{ background: MODEL_STROKE[id] }}
                    aria-hidden="true"
                  />
                  {model.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

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

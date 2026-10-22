"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import {
  visionlabCompareMetrics,
  visionlabCompareTools,
  type VisionlabCompareToolId,
} from "@/lib/visionlab-page";

const TOOL_FILL: Record<VisionlabCompareToolId, string> = {
  visionlab: "#1e1f2b",
  roboflow: "#5c5c62",
  "label-studio": "#7a7a80",
  cvat: "#9a9aa0",
  opencv: "#b8b8bc",
  cloud: "#d4d4d6",
};

const AXIS_SHORT: Record<string, string> = {
  local: "Local",
  live: "Live",
  model: "Models",
  review: "Review",
  nocloud: "On-prem",
};

const WIDTH = 560;
const HEIGHT = 320;
const PAD = { top: 16, right: 12, bottom: 42, left: 36 };
const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;

export function VisionlabCompareChart() {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [active, setActive] = useState(false);
  const [focus, setFocus] = useState<VisionlabCompareToolId | null>(null);

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

  const groupCount = visionlabCompareMetrics.length;
  const barCount = visionlabCompareTools.length;
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
        <title id={`${titleId}-title`}>VisionLab compared to other vision tools</title>
        <desc id={`${titleId}-desc`}>
          Grouped bar chart of industrial workstation scores across local app, live camera, open
          models, review loop, and on-prem deployment for VisionLab, Roboflow, Label Studio, CVAT,
          custom OpenCV, and cloud consoles.
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

        {visionlabCompareMetrics.map((metric, groupIndex) => {
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
              {visionlabCompareTools.map((tool, barIndex) => {
                const id = tool.id as VisionlabCompareToolId;
                const score = metric.scores[id];
                const x = groupX + innerPad + barIndex * (barWidth + barGap);
                const barH = (score / 100) * PLOT_H;
                const y = PAD.top + PLOT_H - barH;
                const dimmed = focus !== null && focus !== id;
                return (
                  <rect
                    key={tool.id}
                    className={`argus-compare__bar${tool.highlight ? " is-highlight" : ""}${dimmed ? " is-dim" : ""}`}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barH}
                    rx={1.5}
                    fill={TOOL_FILL[id]}
                    style={{ "--i": groupIndex * barCount + barIndex } as CSSProperties}
                  >
                    <title>{`${tool.name} · ${metric.label}: ${score}`}</title>
                  </rect>
                );
              })}
            </g>
          );
        })}
      </svg>

      <ul className="argus-compare__legend" aria-label="Tools">
        {visionlabCompareTools.map((tool) => {
          const id = tool.id as VisionlabCompareToolId;
          return (
            <li key={tool.id}>
              <button
                type="button"
                className={`argus-compare__legend-btn${tool.highlight ? " is-highlight" : ""}${focus === id ? " is-focus" : ""}`}
                onMouseEnter={() => setFocus(id)}
                onMouseLeave={() => setFocus(null)}
                onFocus={() => setFocus(id)}
                onBlur={() => setFocus(null)}
              >
                <span className="argus-compare__swatch" style={{ background: TOOL_FILL[id] }} aria-hidden="true" />
                {tool.name}
              </button>
            </li>
          );
        })}
      </ul>

      <table className="argus-compare__table sr-only">
        <caption>Industrial workstation scores by tool</caption>
        <thead>
          <tr>
            <th scope="col">Tool</th>
            {visionlabCompareMetrics.map((metric) => (
              <th key={metric.id} scope="col">
                {metric.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visionlabCompareTools.map((tool) => (
            <tr key={tool.id}>
              <th scope="row">{tool.name}</th>
              {visionlabCompareMetrics.map((metric) => (
                <td key={metric.id}>{metric.scores[tool.id as VisionlabCompareToolId]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

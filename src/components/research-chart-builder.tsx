"use client";

import { useMemo, useState } from "react";
import {
  emptyChart,
  encodeChartToken,
  newChartId,
  normalizeChart,
  type ResearchChart,
  type ResearchChartType,
} from "@/lib/editorial/charts";
import { ResearchFigure } from "@/components/research-figure";

const CHART_MIME = "application/x-spectr-research-chart";

function copyChartStyles(source: HTMLTextAreaElement, target: HTMLElement) {
  const style = window.getComputedStyle(source);
  const props = [
    "boxSizing",
    "width",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "letterSpacing",
    "lineHeight",
    "textAlign",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "whiteSpace",
    "wordBreak",
    "wordWrap",
    "overflowWrap",
  ] as const;
  target.style.whiteSpace = "pre-wrap";
  target.style.wordWrap = "break-word";
  for (const prop of props) {
    target.style[prop] = style[prop] as string;
  }
}

export function caretIndexFromPoint(textarea: HTMLTextAreaElement, clientX: number, clientY: number) {
  const rect = textarea.getBoundingClientRect();
  const x = clientX - rect.left + textarea.scrollLeft;
  const y = clientY - rect.top + textarea.scrollTop;
  const mirror = document.createElement("div");
  copyChartStyles(textarea, mirror);
  mirror.style.position = "absolute";
  mirror.style.left = "-9999px";
  mirror.style.top = "0";
  mirror.style.height = "auto";
  mirror.style.overflow = "auto";
  document.body.appendChild(mirror);

  const value = textarea.value;
  let low = 0;
  let high = value.length;
  const marker = document.createElement("span");
  marker.textContent = "|";

  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    mirror.textContent = "";
    mirror.append(value.slice(0, mid), marker, value.slice(mid));
    const markerTop = marker.offsetTop;
    const markerLeft = marker.offsetLeft;
    if (markerTop + marker.offsetHeight / 2 < y || (Math.abs(markerTop - y) < 18 && markerLeft < x)) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }

  document.body.removeChild(mirror);
  return low;
}

export function ResearchChartBuilder({
  onInsert,
}: {
  onInsert: (token: string) => void;
}) {
  const [draft, setDraft] = useState<ResearchChart>(() => emptyChart("bar"));

  const preview = useMemo(() => normalizeChart(draft), [draft]);

  function tokenForInsert() {
    return encodeChartToken({ ...preview, id: newChartId() });
  }

  function setType(type: ResearchChartType) {
    setDraft((current) => ({ ...current, type }));
  }

  function setPoint(index: number, field: "label" | "value", value: string) {
    setDraft((current) => ({
      ...current,
      points: current.points.map((point, i) =>
        i === index
          ? { ...point, [field]: field === "value" ? Number(value) : value }
          : point,
      ),
    }));
  }

  function addPoint() {
    setDraft((current) => ({
      ...current,
      points: [...current.points, { label: `Series ${current.points.length + 1}`, value: 0 }],
    }));
  }

  function removePoint(index: number) {
    setDraft((current) => ({
      ...current,
      points: current.points.filter((_, i) => i !== index),
    }));
  }

  return (
    <div className="admin-figure-builder">
      <div>
        <p className="admin-figure-builder__kicker">Figures</p>
        <h3>Create a graph</h3>
        <p className="admin-lede" style={{ marginTop: 6 }}>
          Enter the observations, then drag the figure into the essay body. It sits in the text like a journal figure.
        </p>
      </div>

      <fieldset className="admin-figure-builder__types">
        <legend className="sr-only">Chart type</legend>
        {(
          [
            ["bar", "Bar"],
            ["line", "Line"],
            ["pie", "Pie"],
          ] as const
        ).map(([value, label]) => (
          <label key={value}>
            <input type="radio" name="chart-type" checked={draft.type === value} onChange={() => setType(value)} />
            {label}
          </label>
        ))}
      </fieldset>

      <label className="grid gap-1 text-sm text-[#3d3d3d]">
        Title
        <input
          className="field"
          value={draft.title}
          placeholder="Share of delay hours by cause"
          onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
        />
      </label>
      <label className="grid gap-1 text-sm text-[#3d3d3d]">
        Caption (optional)
        <input
          className="field"
          value={draft.caption}
          placeholder="Author calculations from site logs, 2024."
          onChange={(event) => setDraft((current) => ({ ...current, caption: event.target.value }))}
        />
      </label>
      {draft.type !== "pie" ? (
        <label className="grid gap-1 text-sm text-[#3d3d3d]">
          Vertical axis label (optional)
          <input
            className="field"
            value={draft.yLabel}
            placeholder="Hours"
            onChange={(event) => setDraft((current) => ({ ...current, yLabel: event.target.value }))}
          />
        </label>
      ) : null}

      <div className="admin-figure-builder__rows">
        <div className="admin-figure-builder__row-head">
          <span>Label</span>
          <span>Value</span>
        </div>
        {draft.points.map((point, index) => (
          <div key={index} className="admin-figure-builder__row">
            <input
              className="field"
              value={point.label}
              aria-label={`Row ${index + 1} label`}
              onChange={(event) => setPoint(index, "label", event.target.value)}
            />
            <input
              className="field"
              type="number"
              step="any"
              value={Number.isFinite(point.value) ? point.value : 0}
              aria-label={`Row ${index + 1} value`}
              onChange={(event) => setPoint(index, "value", event.target.value)}
            />
            <button type="button" className="admin-text-button" onClick={() => removePoint(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="admin-text-button" onClick={addPoint}>
          Add observation
        </button>
      </div>

      <div className="admin-figure-builder__plot">
        <div
          className="admin-figure-builder__drag"
          draggable
          onDragStart={(event) => {
            const token = tokenForInsert();
            event.dataTransfer.effectAllowed = "copy";
            event.dataTransfer.setData(CHART_MIME, token);
            event.dataTransfer.setData("text/plain", token);
          }}
        >
          <p className="admin-figure-builder__kicker">Drag this figure into the body</p>
          <ResearchFigure chart={preview} number={1} />
        </div>
      </div>

      <button type="button" className="ops-signout w-fit" onClick={() => onInsert(tokenForInsert())}>
        Insert at cursor
      </button>
    </div>
  );
}

export { CHART_MIME };

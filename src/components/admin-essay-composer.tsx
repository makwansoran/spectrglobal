"use client";

import { useMemo, useRef, useState, type CSSProperties, type RefObject } from "react";
import {
  caretIndexFromPoint,
  CHART_MIME,
  ResearchChartBuilder,
} from "@/components/research-chart-builder";
import { insertChartToken } from "@/lib/editorial/charts";
import {
  applyStyleToParagraph,
  essayFontFamilies,
  essayFontSizes,
  essayFontWeights,
  essayStyleVars,
  styleAtIndex,
  type EssayFontFamily,
  type EssayFontSize,
  type EssayFontWeight,
  type EssayTextStyle,
} from "@/lib/editorial/typography";

export function AdminEssayComposer({
  body,
  onChange,
  bodyRef: bodyRefProp,
  placeholder = "Write the essay. Separate paragraphs with a blank line. Drop a figure here.",
}: {
  body: string;
  onChange: (body: string) => void;
  bodyRef?: RefObject<HTMLTextAreaElement | null>;
  placeholder?: string;
}) {
  const innerRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = bodyRefProp ?? innerRef;
  const [dropActive, setDropActive] = useState(false);
  const [cursor, setCursor] = useState(0);

  const style = useMemo(() => styleAtIndex(body, cursor), [body, cursor]);
  const textareaStyle = essayStyleVars(style) as CSSProperties;

  function insertChart(token: string, index?: number) {
    const textarea = bodyRef.current;
    const at = index ?? textarea?.selectionStart ?? body.length;
    const nextBody = insertChartToken(body, token, at);
    const nextCursor = nextBody.indexOf(token, Math.max(0, at - 2)) + token.length;
    onChange(nextBody);
    requestAnimationFrame(() => {
      const field = bodyRef.current;
      if (!field) return;
      field.focus();
      field.setSelectionRange(nextCursor, nextCursor);
      setCursor(nextCursor);
    });
  }

  function applyStyle(patch: EssayTextStyle) {
    const textarea = bodyRef.current;
    const at = textarea?.selectionStart ?? cursor;
    const nextStyle = { ...styleAtIndex(body, at), ...patch };
    const next = applyStyleToParagraph(body, at, nextStyle);
    onChange(next.body);
    requestAnimationFrame(() => {
      const field = bodyRef.current;
      if (!field) return;
      field.focus();
      field.setSelectionRange(next.cursor, next.cursor);
      setCursor(next.cursor);
    });
  }

  function syncCursor(element: HTMLTextAreaElement) {
    setCursor(element.selectionStart);
  }

  return (
    <div className="admin-essay-composer">
      <ResearchChartBuilder
        onInsert={(token) => insertChart(token)}
        overlay={
          <div className="admin-essay-composer__copy">
            <div className="admin-essay-composer__scrim" aria-hidden="true" />
            <div className="admin-type-bar" role="group" aria-label="Body typography">
              <label>
                Font
                <select
                  value={style.fontFamily ?? "sans"}
                  onChange={(event) => applyStyle({ fontFamily: event.target.value as EssayFontFamily })}
                >
                  {Object.entries(essayFontFamilies).map(([value, option]) => (
                    <option key={value} value={value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Size
                <select
                  value={style.fontSize ?? "md"}
                  onChange={(event) => applyStyle({ fontSize: event.target.value as EssayFontSize })}
                >
                  {Object.entries(essayFontSizes).map(([value, option]) => (
                    <option key={value} value={value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Weight
                <select
                  value={style.fontWeight ?? "400"}
                  onChange={(event) => applyStyle({ fontWeight: event.target.value as EssayFontWeight })}
                >
                  {Object.entries(essayFontWeights).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="grid gap-1 text-sm text-[#3d3d3d]">
              Body
              <textarea
                ref={bodyRef}
                name="body"
                required
                draggable={false}
                className={`field min-h-[14rem] admin-essay-composer__body${dropActive ? " is-drop-target" : ""}`}
                placeholder={placeholder}
                value={body}
                style={textareaStyle}
                onChange={(event) => {
                  onChange(event.target.value);
                  syncCursor(event.currentTarget);
                }}
                onSelect={(event) => syncCursor(event.currentTarget)}
                onClick={(event) => syncCursor(event.currentTarget)}
                onKeyUp={(event) => syncCursor(event.currentTarget)}
                onDragEnter={(event) => {
                  if ([...event.dataTransfer.types].includes(CHART_MIME) || [...event.dataTransfer.types].includes("text/plain")) {
                    event.preventDefault();
                    setDropActive(true);
                  }
                }}
                onDragLeave={(event) => {
                  if (event.currentTarget === event.target) setDropActive(false);
                }}
                onDragOver={(event) => {
                  if (
                    [...event.dataTransfer.types].includes(CHART_MIME) ||
                    [...event.dataTransfer.types].includes("text/plain")
                  ) {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "copy";
                  }
                }}
                onDrop={(event) => {
                  const token = event.dataTransfer.getData(CHART_MIME) || event.dataTransfer.getData("text/plain");
                  setDropActive(false);
                  if (!token.includes("%%CHART%%")) return;
                  event.preventDefault();
                  const index = caretIndexFromPoint(event.currentTarget, event.clientX, event.clientY);
                  insertChart(token, index);
                }}
              />
            </label>
          </div>
        }
      />
    </div>
  );
}

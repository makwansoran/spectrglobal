import type { ResearchChart, ResearchChartPoint } from "@/lib/editorial/charts";
import "./research-figure.css";

const INK = "#1c1c1c";
const GRID = "#d8d4cc";
const SLICE = ["#1f3a4d", "#5c6b73", "#8b7355", "#2f5d50", "#6b4f7a", "#7a5c45", "#3d4f5f", "#9a8f7a"];

function maxValue(points: ResearchChartPoint[]) {
  return Math.max(0, ...points.map((point) => point.value));
}

function niceMax(value: number) {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const n = value / magnitude;
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return nice * magnitude;
}

function polar(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function piePath(cx: number, cy: number, r: number, start: number, end: number) {
  const a = polar(cx, cy, r, start);
  const b = polar(cx, cy, r, end);
  const large = end - start > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y} Z`;
}

function AxisChart({ chart }: { chart: ResearchChart }) {
  const points = chart.points;
  const width = 640;
  const height = 340;
  const left = 52;
  const right = 18;
  const top = 16;
  const bottom = 56;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const yMax = niceMax(maxValue(points));
  const ticks = 4;
  const gap = chart.type === "bar" ? plotW / Math.max(points.length, 1) : plotW / Math.max(points.length - 1, 1);
  const barW = Math.min(42, gap * 0.56);
  const coords = points.map((point, index) => {
    const x =
      chart.type === "bar"
        ? left + gap * index + gap / 2
        : left + (points.length === 1 ? plotW / 2 : gap * index);
    const y = top + plotH - (point.value / yMax) * plotH;
    return { ...point, x, y };
  });
  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="research-figure__svg" role="img" aria-label={chart.title || "Chart"}>
      {Array.from({ length: ticks + 1 }, (_, i) => {
        const value = (yMax / ticks) * i;
        const y = top + plotH - (value / yMax) * plotH;
        return (
          <g key={value}>
            <line x1={left} x2={width - right} y1={y} y2={y} stroke={GRID} strokeWidth="1" />
            <text x={left - 8} y={y + 4} textAnchor="end" fill="#6b6b6b" fontSize="11">
              {Number.isInteger(value) ? value : value.toFixed(1)}
            </text>
          </g>
        );
      })}
      <line x1={left} x2={left} y1={top} y2={top + plotH} stroke={INK} strokeWidth="1.25" />
      <line x1={left} x2={width - right} y1={top + plotH} y2={top + plotH} stroke={INK} strokeWidth="1.25" />
      {chart.yLabel ? (
        <text
          x={16}
          y={top + plotH / 2}
          fill="#6b6b6b"
          fontSize="11"
          textAnchor="middle"
          transform={`rotate(-90 16 ${top + plotH / 2})`}
        >
          {chart.yLabel}
        </text>
      ) : null}
      {chart.type === "bar"
        ? coords.map((c) => (
            <rect
              key={c.label}
              x={c.x - barW / 2}
              y={c.y}
              width={barW}
              height={Math.max(0, top + plotH - c.y)}
              fill={INK}
            />
          ))
        : null}
      {chart.type === "line" ? (
        <>
          <path d={line} fill="none" stroke={INK} strokeWidth="1.75" />
          {coords.map((c) => (
            <circle key={c.label} cx={c.x} cy={c.y} r="3.2" fill={INK} />
          ))}
        </>
      ) : null}
      {coords.map((c) => (
        <text key={`${c.label}-x`} x={c.x} y={height - 18} textAnchor="middle" fill="#3d3d3d" fontSize="11">
          {c.label}
        </text>
      ))}
    </svg>
  );
}

function PieChart({ chart }: { chart: ResearchChart }) {
  const points = chart.points.filter((point) => point.value > 0);
  const total = points.reduce((sum, point) => sum + point.value, 0) || 1;
  const cx = 210;
  const cy = 160;
  const r = 118;
  let angle = -Math.PI / 2;

  return (
    <div className="research-figure__pie">
      <svg viewBox="0 0 420 320" className="research-figure__svg" role="img" aria-label={chart.title || "Pie chart"}>
        {points.map((point, index) => {
          const sweep = (point.value / total) * Math.PI * 2;
          const start = angle;
          const end = angle + sweep;
          angle = end;
          if (sweep >= Math.PI * 2 - 0.0001) {
            return <circle key={point.label} cx={cx} cy={cy} r={r} fill={SLICE[index % SLICE.length]} />;
          }
          return (
            <path
              key={point.label}
              d={piePath(cx, cy, r, start, end)}
              fill={SLICE[index % SLICE.length]}
              stroke="#f7f5f0"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      <ul className="research-figure__legend">
        {chart.points.map((point, index) => (
          <li key={point.label}>
            <span style={{ background: point.value > 0 ? SLICE[index % SLICE.length] : GRID }} />
            {point.label} ({point.value})
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ResearchFigure({
  chart,
  number,
}: {
  chart: ResearchChart;
  number: number;
}) {
  const hasData =
    chart.type === "pie" ? chart.points.some((point) => point.value > 0) : chart.points.length > 0;

  return (
    <figure className="research-figure">
      <div className="research-figure__plot">
        {hasData ? (
          chart.type === "pie" ? (
            <PieChart chart={chart} />
          ) : (
            <AxisChart chart={chart} />
          )
        ) : (
          <p className="research-figure__empty">No observations entered.</p>
        )}
      </div>
      <figcaption>
        <strong>Figure {number}.</strong>{" "}
        {chart.title || "Untitled figure"}
        {chart.caption ? ` ${chart.caption}` : ""}
      </figcaption>
    </figure>
  );
}

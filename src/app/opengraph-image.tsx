import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Spectr — humanoid robotics and a free AI WMS";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(140deg, #050609 0%, #0d1020 55%, #050609 100%)",
          color: "#f2f4f8",
          padding: "72px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <svg width="48" height="48" viewBox="0 0 100 100" fill="none" stroke="#f2f4f8">
            <ellipse cx="45" cy="50" rx="40" ry="45" strokeWidth="9" />
            <ellipse cx="62" cy="50" rx="26" ry="38" strokeWidth="8" />
          </svg>
          <div style={{ fontSize: "26px", letterSpacing: "0.34em", fontWeight: 600 }}>SPECTR</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "68px",
              fontWeight: 600,
              lineHeight: 1.04,
              letterSpacing: "-0.045em",
              maxWidth: "920px",
            }}
          >
            Robots that work the floor. Software that runs it.
          </div>
          <div style={{ marginTop: "30px", fontSize: "26px", color: "rgba(242,244,248,0.55)" }}>
            Humanoid robotics · A free AI WMS for enterprises · Norway
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

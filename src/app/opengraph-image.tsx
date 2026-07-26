import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Spectr — Droid and Spectr C2";

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
          background: "#f7f7f5",
          color: "#0a0a0b",
          padding: "72px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              background: "#050609",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            S
          </div>
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
          <div style={{ marginTop: "30px", fontSize: "26px", color: "rgba(10,10,11,0.5)" }}>
            Droid · Spectr C2 · Norway
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

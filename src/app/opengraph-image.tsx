import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Spectr — autonomous drone software from Norway";

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
          background: "#0b0c0d",
          color: "#ffffff",
          padding: "72px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0b0c0d",
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div style={{ fontSize: "28px", letterSpacing: "0.34em", fontWeight: 600 }}>SPECTR</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "72px",
              fontWeight: 600,
              lineHeight: 0.95,
              letterSpacing: "-0.06em",
              maxWidth: "900px",
            }}
          >
            Autonomous drone software from Norway
          </div>
          <div style={{ marginTop: "28px", fontSize: "28px", color: "rgba(255,255,255,0.62)" }}>
            CENTURION · Sovereign · EW-resilient
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

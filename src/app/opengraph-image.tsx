import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Spectr — pioneering world models";

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
          background: "#ffffff",
          color: "#0a0c12",
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
              background: "#0a0c12",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
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
            Pioneering world models
          </div>
          <div style={{ marginTop: "28px", fontSize: "28px", color: "rgba(10,12,18,0.55)" }}>
            Spectr RTS · General world model · Built in Norway
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

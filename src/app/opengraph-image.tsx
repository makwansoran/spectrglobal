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
          background: "#07080c",
          color: "#f4f5f7",
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
              background: "#f4f5f7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#07080c",
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
          <div style={{ marginTop: "28px", fontSize: "28px", color: "rgba(244,245,247,0.55)" }}>
            Spectr RTS · General world model · Built in Norway
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

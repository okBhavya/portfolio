import { ImageResponse } from "next/og";

export const alt = "Bhavya Gupta — AI, Engineering & Product Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

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
          padding: "64px",
          backgroundColor: "#F7F3EB",
          color: "#1F2421",
          border: "14px solid #1F2421",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "#EFE8DA",
              border: "2.5px solid #1F2421",
              borderRadius: "999px",
              padding: "10px 22px",
              fontSize: "22px",
              fontFamily: "sans-serif",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "999px",
                backgroundColor: "#1F5E4B",
              }}
            />
            BITS Pilani · Computer Science &apos;27
          </div>
          <div
            style={{
              fontSize: "22px",
              fontFamily: "monospace",
              color: "#D96B27",
              fontWeight: 700,
            }}
          >
            AI / SYSTEMS / PRODUCT
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              fontSize: "34px",
              color: "#D96B27",
              fontFamily: "sans-serif",
              fontWeight: 700,
            }}
          >
            Hey, I&apos;m Bhavya Gupta.
          </div>
          <div
            style={{
              fontSize: "62px",
              lineHeight: 1.08,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Building intelligent systems &amp; products people actually use.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2.5px solid #D7CEBE",
            paddingTop: "24px",
            fontSize: "22px",
            fontFamily: "sans-serif",
            color: "#4A514C",
          }}
        >
          <span>World Models · PlanPilot · Distributed Task Queue · Customer Intelligence</span>
          <span style={{ color: "#1F5E4B", fontWeight: 700 }}>github.com/okBhavya</span>
        </div>
      </div>
    ),
    { ...size }
  );
}

import { ImageResponse } from "next/og";
import { SITE_URL } from "@/data/profile";

export const dynamic = "force-static";
export const alt = "Bhavya Gupta — AI, Engineering & Product Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  const displayHost = SITE_URL.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
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
              fontWeight: 700,
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
            BITS Pilani · B.E. CSE &apos;27
          </div>
          <div
            style={{
              fontSize: "22px",
              fontFamily: "monospace",
              color: "#B54B0D",
              fontWeight: 700,
            }}
          >
            AI / ENGINEERING / PRODUCT
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div
            style={{
              fontSize: "48px",
              color: "#B54B0D",
              fontFamily: "sans-serif",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Bhavya Gupta
          </div>
          <div
            style={{
              fontSize: "52px",
              lineHeight: 1.12,
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
            paddingTop: "22px",
            fontSize: "21px",
            fontFamily: "sans-serif",
            fontWeight: 600,
            color: "#3A413C",
          }}
        >
          <span>{displayHost}</span>
          <span style={{ color: "#1F5E4B", fontWeight: 700 }}>
            github.com/okBhavya
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

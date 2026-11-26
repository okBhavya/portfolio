import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f7f3eb",
          border: "10px solid #1f2421",
          borderRadius: "38px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "136px",
            height: "136px",
            borderRadius: "24px",
            backgroundColor: "#efe8da",
            fontSize: "72px",
            fontWeight: 800,
            color: "#1f2421",
            fontFamily: "Georgia, serif",
          }}
        >
          BG
        </div>
        <div
          style={{
            position: "absolute",
            top: "22px",
            right: "22px",
            width: "22px",
            height: "22px",
            borderRadius: "999px",
            backgroundColor: "#b54b0d",
            border: "4px solid #1f2421",
          }}
        />
      </div>
    ),
    { ...size }
  );
}

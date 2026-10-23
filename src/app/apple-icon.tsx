import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
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
          background: "#252823",
        }}
      >
        <div
          style={{
            fontSize: 110,
            fontWeight: 700,
            color: "#F6F3ED",
            fontFamily: "sans-serif",
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          M
        </div>
      </div>
    ),
    size,
  );
}

import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Branded link-preview card, served automatically as the og:image (and
// twitter:image) for every page. 1200×630 is the standard share-card size.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Hungry Worms — Canterbury's full-circle food & green-waste recycling";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logos/hungry-worms.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "80px",
          background: "linear-gradient(135deg, #0F5132 0%, #1F8A4C 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 40 }}>
          <div style={{ display: "flex", background: "white", borderRadius: 24, padding: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} width={72} height={72} alt="" />
          </div>
          <span style={{ fontSize: 40, fontWeight: 700 }}>Hungry Worms</span>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", fontSize: 68, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
          Turn your food waste into a sustainability story.
        </div>

        {/* Tagline */}
        <div style={{ display: "flex", fontSize: 30, marginTop: 32, color: "#A8D63A" }}>
          Canterbury&apos;s full-circle food &amp; green-waste recycling
        </div>
      </div>
    ),
    { ...size }
  );
}

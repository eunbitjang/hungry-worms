/**
 * Renders every `.slide` in an HTML file to a PNG at its own natural size
 * (1080 × 1350 for the carousel canvas).
 *
 *   npx playwright@1.62.1 ... is not needed — this uses the installed browser:
 *   node social/render.mjs social/comps/comps.html social/out/comps
 *
 * Each slide needs a `data-id`; the PNG is named after it.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const [, , input, outDir = "social/out"] = process.argv;
if (!input) {
  console.error("usage: node social/render.mjs <input.html> [outDir]");
  process.exit(1);
}

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1080, height: 1350 },
  deviceScaleFactor: 1,
});

await page.goto(pathToFileURL(path.resolve(input)).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(600);

const slides = await page.$$(".slide[data-id]");
for (const slide of slides) {
  const id = await slide.getAttribute("data-id");
  const file = path.join(outDir, `${id}.png`);
  await slide.screenshot({ path: file });
  console.log("wrote", file);
}

await browser.close();

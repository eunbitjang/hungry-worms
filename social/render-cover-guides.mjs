import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import path from "node:path";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1640, height: 720 }, deviceScaleFactor: 1 });
const url = pathToFileURL(path.resolve("social/facebook-cover.html")).href + "?guides";
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(700);
await (await page.$(".cover")).screenshot({ path: "social/out/facebook/facebook-cover-GUIDES.png" });
console.log("wrote social/out/facebook/facebook-cover-GUIDES.png");
await browser.close();

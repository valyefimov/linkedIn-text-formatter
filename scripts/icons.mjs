// Renders the app icons (PNG) from one SVG with headless Chrome. Run: node scripts/icons.mjs
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CHROME =
  process.env.CHROME ??
  ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find(existsSync);
if (!CHROME) throw new Error("Chrome not found. Set CHROME=/path/to/chrome");

/** `inset` shrinks the artwork toward the centre: maskable icons keep it inside the safe zone. */
const svg = ({ rounded, inset }) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1b86e6"/>
      <stop offset="1" stop-color="#0a66c2"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="0%" r="90%">
      <stop offset="0" stop-color="#fff" stop-opacity=".28"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" rx="${rounded ? 112 : 0}" fill="url(#g)"/>
  <rect width="512" height="512" rx="${rounded ? 112 : 0}" fill="url(#glow)"/>
  <g transform="translate(256 256) scale(${inset}) translate(-256 -256)">
    <text x="256" y="334" text-anchor="middle" font-family="Helvetica Neue, Arial, sans-serif" font-weight="800" font-size="320" fill="#fff">B</text>
    <rect x="146" y="386" width="220" height="24" rx="12" fill="#fff" opacity=".92"/>
  </g>
</svg>`;

const ICONS = [
  { file: "public/icons/icon-192.png", size: 192, rounded: true, inset: 1 },
  { file: "public/icons/icon-512.png", size: 512, rounded: true, inset: 1 },
  { file: "public/icons/maskable-512.png", size: 512, rounded: false, inset: 0.72 },
  { file: "src/app/icon.png", size: 512, rounded: true, inset: 1 },
  { file: "src/app/apple-icon.png", size: 180, rounded: false, inset: 0.86 },
];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
try {
  const page = await browser.newPage();
  for (const { file, size, rounded, inset } of ICONS) {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await page.setContent(`<!doctype html><body style="margin:0;background:transparent">${svg({ rounded, inset })}</body>`);
    const out = join(root, file);
    mkdirSync(dirname(out), { recursive: true });
    await page.screenshot({ path: out, omitBackground: true });
    console.log(`🖼  ${file}`);
  }
} finally {
  await browser.close();
}

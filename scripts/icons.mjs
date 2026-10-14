// Draws the app icon as SVG and renders every size with headless Chrome.
// Outputs: PNG icons for the manifest and Apple, src/app/icon.svg and a multi-size favicon.ico.
// Run: node scripts/icons.mjs
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CHROME =
  process.env.CHROME ??
  ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find(existsSync);
if (!CHROME) throw new Error("Chrome not found. Set CHROME=/path/to/chrome");

// A heavy "B" drawn as paths (no font needed); the two counters are cut out with evenodd.
const LETTER_B =
  "M150 104H282C348 104 390 139 390 194C390 230 372 254 343 266C382 277 406 305 406 348C406 410 361 452 286 452H150Z" +
  "M216 157V240H272C300 240 320 228 320 198C320 168 300 157 272 157Z" +
  "M216 296V399H282C315 399 338 384 338 347C338 311 315 296 282 296Z";

const SPARKLE = "M404 92C408 124 420 136 452 140C420 144 408 156 404 188C400 156 388 144 356 140C388 136 400 124 404 92Z";

/**
 * `rounded` draws the squircle (any-purpose icons); otherwise the art is full-bleed.
 * `inset` shrinks the artwork towards the centre to stay inside a maskable safe zone.
 * `detail` adds the sparkle and underline, which are dropped at favicon sizes.
 */
export const mark = ({ rounded = true, inset = 1, detail = true } = {}) => {
  const r = rounded ? 116 : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0.1" y1="0" x2="0.9" y2="1">
      <stop offset="0" stop-color="#3fa4ff"/>
      <stop offset="0.5" stop-color="#0a66c2"/>
      <stop offset="1" stop-color="#073b78"/>
    </linearGradient>
    <radialGradient id="shine" cx="30%" cy="0%" r="85%">
      <stop offset="0" stop-color="#fff" stop-opacity=".42"/>
      <stop offset="0.6" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ink" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff"/>
      <stop offset="1" stop-color="#cfe6ff"/>
    </linearGradient>
    <filter id="lift" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#021a3a" flood-opacity=".45"/>
    </filter>
  </defs>
  <rect width="512" height="512" rx="${r}" fill="url(#bg)"/>
  <rect width="512" height="512" rx="${r}" fill="url(#shine)"/>
  ${rounded ? `<rect x="2" y="2" width="508" height="508" rx="${r - 2}" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="4"/>` : ""}
  <g transform="translate(256 256) scale(${inset}) translate(-256 -256)">
    <g transform="translate(${detail ? -14 : 0} ${detail ? -12 : 0})">
      <path d="${LETTER_B}" fill="url(#ink)" fill-rule="evenodd" filter="url(#lift)"/>
    </g>
    ${
      detail
        ? `<rect x="136" y="446" width="236" height="22" rx="11" fill="#fff" fill-opacity=".92"/>
    <path d="${SPARKLE}" fill="#fff"/>`
        : ""
    }
  </g>
</svg>`;
};

const PNGS = [
  { file: "public/icons/icon-192.png", size: 192, opts: {} },
  { file: "public/icons/icon-512.png", size: 512, opts: {} },
  { file: "public/icons/maskable-512.png", size: 512, opts: { rounded: false, inset: 0.74 } },
  { file: "src/app/apple-icon.png", size: 180, opts: { rounded: false, inset: 0.88 } },
];
const FAVICON_SIZES = [16, 32, 48];

/** Packs PNG images into an .ico (PNG payloads are valid in ICO since Windows Vista). */
const ico = (images) => {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size % 256, 0);
    entry.writeUInt8(size % 256, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
};

const write = (file, data) => {
  const out = join(root, file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, data);
  console.log(`🖼  ${file}`);
};

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
try {
  const page = await browser.newPage();
  const render = async (size, svg) => {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await page.setContent(
      `<!doctype html><body style="margin:0;background:transparent"><div style="width:${size}px;height:${size}px">${svg.replace("<svg ", `<svg width="${size}" height="${size}" `)}</div></body>`,
    );
    return page.screenshot({ omitBackground: true, type: "png" });
  };

  for (const { file, size, opts } of PNGS) write(file, await render(size, mark(opts)));

  const faviconImages = [];
  for (const size of FAVICON_SIZES) faviconImages.push({ size, data: await render(size, mark({ detail: false })) });
  write("src/app/favicon.ico", ico(faviconImages));
  write("src/app/icon.svg", mark({ detail: true }) + "\n");
} finally {
  await browser.close();
}

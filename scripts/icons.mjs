// Renders the generated source artwork at every app icon size with headless Chrome.
// Source: scripts/assets/icon-source.png. Outputs: app/PWA PNGs and a multi-size favicon.ico.
// Run: node scripts/icons.mjs
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CHROME =
  process.env.CHROME ??
  ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find(existsSync);
if (!CHROME) throw new Error("Chrome not found. Set CHROME=/path/to/chrome");

const source = `data:image/png;base64,${readFileSync(join(root, "scripts/assets/icon-source.png")).toString("base64")}`;
const PNGS = [
  { file: "public/icons/icon-192.png", size: 192, rounded: true },
  { file: "public/icons/icon-512.png", size: 512, rounded: true },
  { file: "public/icons/maskable-512.png", size: 512 },
  { file: "src/app/apple-icon.png", size: 180 },
  { file: "src/app/icon.png", size: 512, rounded: true },
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
  const render = async (size, rounded = false) => {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await page.setContent(
      `<!doctype html><body style="margin:0;background:transparent"><img src="${source}" style="display:block;width:${size}px;height:${size}px;${rounded ? "border-radius:22.5%;" : ""}" /></body>`,
    );
    await page.evaluate(async () => {
      await Promise.all(Array.from(document.images, (image) => image.decode()));
    });
    return page.screenshot({ omitBackground: true, type: "png" });
  };

  for (const { file, size, rounded } of PNGS) write(file, await render(size, rounded));

  const faviconImages = [];
  for (const size of FAVICON_SIZES) faviconImages.push({ size, data: await render(size, true) });
  write("src/app/favicon.ico", ico(faviconImages));
} finally {
  await browser.close();
}

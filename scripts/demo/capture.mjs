// Drives the real app in headless Chrome and saves the frames used by the demo video and the README.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const shotsDir = join(root, "scripts/demo/.shots");
const PORT = 3113;
const URL_ = `http://localhost:${PORT}`;
const CHROME =
  process.env.CHROME ??
  ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find(existsSync);

if (!CHROME) throw new Error("Chrome not found. Set CHROME=/path/to/chrome");
mkdirSync(shotsDir, { recursive: true });

const POST = [
  "Shipped my first open-source project today.",
  "",
  "It took three weekends, two rewrites and a lot of coffee.",
  "",
  "What I learned:",
  "start smaller than you think",
  "ship before it feels ready",
  "write the README first",
  "",
  "#buildinpublic #opensource",
].join("\n");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const server = spawn("npx", ["next", "start", "-p", String(PORT)], { cwd: root, stdio: "ignore" });
const stop = () => server.kill();
process.on("exit", stop);

const waitForServer = async () => {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(URL_)).ok) return;
    } catch {
      // not up yet
    }
    await sleep(500);
  }
  throw new Error("Server did not start. Run `npm run build` first.");
};

await waitForServer();
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--hide-scrollbars"] });

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
  await page.evaluateOnNewDocument(() => {
    localStorage.clear();
    localStorage.setItem("ltf:theme", "dark");
    localStorage.setItem("ltf:device", JSON.stringify("desktop"));
  });
  await page.goto(URL_, { waitUntil: "networkidle0" });
  await sleep(1600);

  const shot = async (name, { scrollTo = null, offset = 16, settle = 700 } = {}) => {
    await page.evaluate(
      (selector, off) => {
        if (selector === null) return window.scrollTo(0, 0);
        const el = document.querySelector(selector);
        if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - off);
      },
      scrollTo,
      offset,
    );
    await sleep(settle);
    await page.screenshot({ path: join(shotsDir, `${name}.png`) });
    console.log(`📸 ${name}`);
  };

  const setValue = (selector, value) =>
    page.evaluate(
      (sel, v) => {
        const el = document.querySelector(sel);
        const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement : HTMLInputElement;
        Object.getOwnPropertyDescriptor(proto.prototype, "value").set.call(el, v);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      },
      selector,
      value,
    );

  const click = (selector) => page.evaluate((s) => document.querySelector(s)?.click(), selector);
  const clickText = (tag, text) =>
    page.evaluate(
      (t, label) => [...document.querySelectorAll(t)].find((el) => el.textContent.trim() === label)?.click(),
      tag,
      text,
    );
  const tool = (label) => click(`button[aria-label="${label}"]`);

  const select = (phrase) =>
    page.evaluate((p) => {
      const area = document.querySelector("textarea");
      const at = area.value.indexOf(p);
      area.focus();
      area.setSelectionRange(at, at + p.length);
    }, phrase);

  const caretToEnd = () =>
    page.evaluate(() => {
      const area = document.querySelector("textarea");
      area.focus();
      area.setSelectionRange(area.value.length, area.value.length);
    });

  const TEXTAREA = "textarea";

  // 1. Hero with an empty editor
  await shot("01-hero", { scrollTo: null });

  // 2. Write a post, then format it
  await setValue('input[aria-label="Preview name"]', "Valentyn Yefimov");
  await setValue('input[aria-label="Preview headline"]', "Software engineer · Building in public");
  await setValue(TEXTAREA, POST);
  await sleep(300);
  await shot("02-written", { scrollTo: "section[aria-label='Editor']" });

  await select("Shipped my first open-source project today.");
  await tool("Bold");
  await sleep(200);
  await select("a lot of coffee");
  await tool("Italic");
  await sleep(200);
  await select("What I learned:");
  await tool("Bold");
  await sleep(200);
  await select("#buildinpublic #opensource");
  await tool("Underline");
  await caretToEnd();
  await shot("03-formatted", { scrollTo: "section[aria-label='Editor']" });

  // 3. Lists and emoji
  await select("start smaller than you think\nship before it feels ready\nwrite the README first");
  await tool("Bullet list");
  await caretToEnd();
  await tool("Emoji and symbols");
  await shot("04-lists-emoji", { scrollTo: "section[aria-label='Editor']" });
  await page.evaluate(() => {
    const area = document.querySelector("textarea");
    area.focus();
    // The bold letters are astral characters, but the final "." stays ASCII.
    const end = area.value.indexOf(".") + 1;
    area.setSelectionRange(end, end);
  });
  await page.evaluate(() => [...document.querySelectorAll("[role=dialog] button")].find((b) => b.textContent === "🚀")?.click());
  await sleep(400);

  // README screenshot: the whole editor with the preview next to it
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 });
  await sleep(500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(400);
  await page.screenshot({ path: join(root, "docs/screenshot.png"), clip: { x: 0, y: 0, width: 1440, height: 1000 } });
  console.log("📸 docs/screenshot.png");
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
  await sleep(500);

  // 4. Markdown mode
  await clickText("button", "Markdown");
  await sleep(500);
  await clickText("button", "Try a sample");
  await sleep(500);
  await page.evaluate(() => {
    const area = document.querySelector("textarea");
    area.style.minHeight = "150px";
    area.style.height = "150px";
  });
  await shot("05-markdown", { scrollTo: "section[aria-label='Editor']", offset: 12 });

  // 5. Code: monospace, then bold
  await page.evaluate(() => document.querySelector("pre")?.scrollIntoView({ block: "end" }));
  await page.evaluate(() => {
    const pre = document.querySelector("pre");
    pre.scrollTop = 160;
  });
  await shot("06-code-mono", { scrollTo: "section[aria-label='Editor']", offset: 12 });
  await page.select("select", "bold");
  await sleep(400);
  await page.evaluate(() => (document.querySelector("pre").scrollTop = 160));
  await shot("07-code-bold", { scrollTo: "section[aria-label='Editor']", offset: 12 });
  await page.select("select", "monospace");

  // 6. Preview on mobile and desktop
  await clickText("button", "Write");
  await sleep(500);
  await page.evaluate(() => {
    const area = document.querySelector("textarea");
    area.style.height = "";
  });
  await click('button[aria-label="mobile"]');
  await shot("08-preview-mobile", { scrollTo: "section[aria-label='Post preview']", offset: 24, settle: 1200 });
  await click('button[aria-label="desktop"]');
  await shot("09-preview-desktop", { scrollTo: "section[aria-label='Post preview']", offset: 24, settle: 1200 });

  // 7. Limits: a post, then a headline that is too long
  const meter = "[role=radiogroup][aria-label='Limit for']";
  await shot("10-limits-post", { scrollTo: meter, offset: 24 });
  await clickText("button", "Headline");
  await shot("11-limits-headline", { scrollTo: meter, offset: 24 });
  await clickText("button", "Post");

  // 8. Light theme
  await tool("Switch to light theme");
  await sleep(600);
  await shot("12-light", { scrollTo: "section[aria-label='Editor']" });
} finally {
  await browser.close();
  stop();
}

// Builds docs/demo.mp4: real UI frames (see capture.mjs), narration by termdub,
// burned-in captions, and an ambient music bed that ducks under the voice.
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compose } from "@vefimov/termdub";
import { music } from "./music.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const shots = join(root, "scripts/demo/.shots");
const buildDir = join(root, "scripts/demo/.build");
const narrated = join(buildDir, "narrated.mp4");
const bed = join(buildDir, "music.wav");
const out = join(root, "docs/demo.mp4");

const FONT = `-apple-system, "SF Pro Display", "Segoe UI", Roboto, sans-serif`;

const page = (body, extra = "") => `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box}
html,body{margin:0;width:1280px;height:720px;overflow:hidden;background:#131316;color:#ededed;font-family:${FONT}}
.shot{position:absolute;inset:0;width:1280px;height:720px;object-fit:cover}
.shade{position:absolute;inset:auto 0 0 0;height:190px;background:linear-gradient(transparent,rgba(0,0,0,.55))}
.cap{position:absolute;left:0;right:0;bottom:34px;display:flex;justify-content:center;padding:0 90px}
.cap span{padding:12px 24px;border-radius:14px;background:rgba(12,12,14,.86);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:27px;line-height:1.38;text-align:center;letter-spacing:-.01em}
${extra}</style></head><body>${body}</body></html>`;

const caption = (text) => (text ? `<div class="cap"><span>${text.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</span></div>` : "");

const shotFrame = (file, text) =>
  page(`<img class="shot" src="file://${join(shots, `${file}.png`)}"><div class="shade"></div>${caption(text)}`);

const card = (title, sub, text, extra = "") =>
  page(
    `<main><p class="kicker">${sub}</p><h1>${title}</h1>${extra}</main>${caption(text)}`,
    `main{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;gap:18px;text-align:center;padding-bottom:120px;
      background:radial-gradient(ellipse 70% 55% at 50% 38%,rgba(10,102,194,.32),transparent 70%),#131316}
    .kicker{margin:0;padding:6px 14px;border:1px solid #2b2b31;border-radius:999px;background:#1a1a1e;color:#a1a1a1;font-size:18px}
    h1{margin:0;font-size:84px;line-height:1.02;letter-spacing:-.045em;font-weight:650;
      background:linear-gradient(90deg,#fff,#70b5f9 60%,#0a66c2);-webkit-background-clip:text;background-clip:text;color:transparent}
    .links{display:flex;gap:26px;font-size:24px;color:#a1a1a1}.links b{color:#ededed;font-weight:500}`,
  );

// Each scene lists, per sentence of its narration, which frame to show.
const scenes = [
  {
    say: "LinkedIn has no rich text. So I built an editor that fixes that.",
    show: () => (text) => card("LinkedIn Text Formatter", "A free post editor", text),
  },
  {
    say: "This is LinkedIn Text Formatter. It's free, it runs in your browser, and there's nothing to sign up for.",
    show: () => (text) => shotFrame("01-hero", text),
  },
  {
    say: "Write your post the way you normally would. Then select a phrase and hit bold, italic or underline. Under the hood, it swaps letters for Unicode look-alikes, so it pastes straight into LinkedIn.",
    frames: ["02-written", "03-formatted", "03-formatted"],
  },
  {
    say: "One click turns lines into bullet lists, numbered lists or checklists. And there's an emoji picker for the finishing touch.",
    frames: ["04-lists-emoji", "04-lists-emoji"],
  },
  {
    say: "Already have your draft in Markdown? Switch to Markdown mode and it converts live. Headings turn bold, lists get bullets, and pasted Markdown is converted automatically.",
    frames: ["05-markdown", "05-markdown", "05-markdown"],
  },
  {
    say: "Code stays readable too. Inline code and code blocks become monospace. Prefer something louder? One option makes code bold instead.",
    frames: ["06-code-mono", "06-code-mono", "07-code-bold"],
  },
  {
    say: "The preview shows your post as it will appear in the feed. Switch to mobile to see exactly where the see more cut-off lands.",
    frames: ["09-preview-desktop", "08-preview-mobile"],
  },
  {
    say: "Live counters track the limits for posts, comments, headlines and About sections. Go over, and the counter turns red.",
    frames: ["10-limits-post", "11-limits-headline"],
  },
  {
    say: "Prefer a light theme? It's one click away.",
    frames: ["12-light", "12-light"],
  },
  {
    say: "That's LinkedIn Text Formatter. Free and private, nothing leaves your browser. Built by Valentyn Yefimov.",
    show: () => (text) =>
      card("Write it. Format it. Post it.", "LinkedIn Text Formatter", text, `<div class="links"><b>linkedin.yefimov.tech</b><span>Valentyn Yefimov</span><span>github.com/valyefimov</span></div>`),
  },
].map((scene) => ({
  say: scene.say,
  frame: (() => {
    let last = 0;
    return (ctx) => {
      if (ctx.sentence >= 0) last = ctx.sentence;
      if (scene.show) return scene.show()(ctx.caption);
      return shotFrame(scene.frames[Math.min(last, scene.frames.length - 1)], ctx.caption);
    };
  })(),
}));

const run = (cmd, args) => {
  const res = spawnSync(cmd, args, { encoding: "utf8" });
  if (res.status !== 0) throw new Error(`${cmd} failed:\n${res.stderr}`);
  return res.stdout.trim();
};

rmSync(buildDir, { recursive: true, force: true });
mkdirSync(buildDir, { recursive: true });

const { seconds } = await compose({
  out: narrated,
  size: { width: 1280, height: 720 },
  tts: { provider: "edge", voice: process.env.DEMO_VOICE ?? "en-US-AndrewNeural", rate: "+2%" },
  timing: { lead: 0.5, tail: 0.8, gap: 0.3 },
  poster: { at: 14, file: join(root, "docs/demo-poster.png") },
  workDir: join(buildDir, "work"),
  scenes,
});

music(bed, Math.ceil(seconds) + 2);

// The music bed is mixed under the voice and ducks a few dB whenever someone is speaking.
run("ffmpeg", [
  "-y", "-loglevel", "error", "-i", narrated, "-i", bed,
  "-filter_complex",
  "[1:a]volume=2.2[m];[0:a]asplit=2[v][sc];[m][sc]sidechaincompress=threshold=0.02:ratio=4:attack=30:release=400[duck];[v][duck]amix=inputs=2:duration=first:normalize=0[a]",
  "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out,
]);

console.log(`🎵 ${out} (${seconds.toFixed(1)}s)`);

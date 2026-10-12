// Generates an original ambient track with ffmpeg (no samples, no licensing): a soft pad
// over an Am-F-C-G progression with a gentle plucked arpeggio. Usage: music(outFile, seconds).
import { spawnSync } from "node:child_process";

const CHORDS = [
  [110.0, 164.81, 220.0, 261.63], // Am
  [87.31, 130.81, 174.61, 220.0], // F
  [130.81, 196.0, 261.63, 329.63], // C
  [98.0, 146.83, 196.0, 246.94], // G
];
const BAR = 4;

const chordIndex = `floor(mod(t/${BAR},${CHORDS.length}))`;
const pick = (build) =>
  CHORDS.reduceRight((rest, notes, i) => (rest === null ? build(notes) : `if(eq(${chordIndex},${i}),${build(notes)},${rest})`), null);

const pad = (phase) =>
  pick((notes) => notes.map((f) => `(0.07*sin(2*PI*${f}*t+${phase})+0.05*sin(2*PI*${(f * 1.004).toFixed(3)}*t))`).join("+"));

const pluck = (phase) => {
  const step = (n) => `if(eq(mod(floor(t/0.5),4),${n}),`;
  const note = (notes, n) => `sin(2*PI*${notes[n] * 2}*t+${phase})`;
  return pick(
    (notes) => `(${step(0)}${note(notes, 0)},${step(1)}${note(notes, 2)},${step(2)}${note(notes, 3)},${note(notes, 1)})))*exp(-5*mod(t,0.5))*0.09)`,
  );
};

const envelope = `pow(sin(PI*mod(t,${BAR})/${BAR}),0.5)`;
const channel = (phase) => `(${envelope}*(${pad(phase)})*(0.85+0.15*sin(2*PI*0.25*t))+${pluck(phase)})`;

export function music(out, seconds) {
  const expr = `${channel(0)}|${channel(0.4)}`;
  const res = spawnSync(
    "ffmpeg",
    [
      "-y", "-loglevel", "error",
      "-f", "lavfi", "-i", `aevalsrc='${expr}':s=44100:d=${seconds}`,
      "-af", `lowpass=f=2400,aecho=0.8:0.7:480|760:0.3|0.22,afade=t=in:d=3,afade=t=out:st=${Math.max(0, seconds - 4)}:d=4`,
      out,
    ],
    { encoding: "utf8" },
  );
  if (res.status !== 0) throw new Error(`ffmpeg failed: ${res.stderr}`);
}

export type TargetId = "post" | "comment" | "headline" | "about";

export interface Target {
  id: TargetId;
  label: string;
  max: number;
}

/** LinkedIn field limits. Only the post limit is documented by LinkedIn; the rest are observed. */
export const TARGETS: readonly Target[] = [
  { id: "post", label: "Post", max: 3000 },
  { id: "comment", label: "Comment", max: 1250 },
  { id: "headline", label: "Headline", max: 220 },
  { id: "about", label: "About", max: 2600 },
];

export type Device = "mobile" | "desktop";

/** Approximate number of characters shown before "…see more". LinkedIn changes this silently. */
export const SEE_MORE_CHARS: Record<Device, number> = { mobile: 140, desktop: 210 };
export const SEE_MORE_LINES = 3;

export type LimitState = "ok" | "warn" | "over";

export interface Usage {
  count: number;
  max: number;
  remaining: number;
  ratio: number;
  state: LimitState;
}

/** Counts characters the way a reader sees them: by code point, not UTF-16 unit. */
export const countChars = (text: string): number => {
  let count = 0;
  for (const _ of text) count++;
  return count;
};

export const getUsage = (text: string, max: number): Usage => {
  const count = countChars(text);
  const ratio = count / max;
  return {
    count,
    max,
    remaining: max - count,
    ratio,
    state: count > max ? "over" : ratio >= 0.9 ? "warn" : "ok",
  };
};

export interface Fold {
  visible: string;
  hidden: string;
  truncated: boolean;
}

/** Splits text where LinkedIn would insert "…see more" (character or line limit, whichever comes first). */
export const foldText = (text: string, device: Device): Fold => {
  const chars = Array.from(text);
  const maxChars = SEE_MORE_CHARS[device];

  let cut = chars.length;
  let lines = 1;
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === "\n" && ++lines > SEE_MORE_LINES) {
      cut = i;
      break;
    }
  }
  cut = Math.min(cut, maxChars);

  if (cut >= chars.length) return { visible: text, hidden: "", truncated: false };
  return {
    visible: chars.slice(0, cut).join("").trimEnd(),
    hidden: chars.slice(cut).join(""),
    truncated: true,
  };
};

export const wordCount = (text: string): number => text.trim().split(/\s+/).filter(Boolean).length;

/** Average adult reading speed of ~230 wpm, rounded up to whole seconds. */
export const readingSeconds = (text: string): number => Math.ceil((wordCount(text) / 230) * 60);

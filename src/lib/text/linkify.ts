export type SegmentKind = "text" | "hashtag" | "mention" | "url";

export interface Segment {
  kind: SegmentKind;
  text: string;
}

const PATTERN = /(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"])|(#[\p{L}\p{N}_]+)|(@[\p{L}\p{N}_][\p{L}\p{N}_.-]*)/gu;

/** Splits text into plain, #hashtag, @mention and URL segments, the way LinkedIn highlights them. */
export const linkify = (text: string): Segment[] => {
  const segments: Segment[] = [];
  let last = 0;
  for (const match of text.matchAll(PATTERN)) {
    const index = match.index ?? 0;
    const prev = index > 0 ? text[index - 1] : "";
    const glued = match[1] === undefined && prev !== undefined && /[\p{L}\p{N}]/u.test(prev);
    if (glued) continue;
    if (index > last) segments.push({ kind: "text", text: text.slice(last, index) });
    segments.push({ kind: match[1] ? "url" : match[2] ? "hashtag" : "mention", text: match[0] });
    last = index + match[0].length;
  }
  if (last < text.length) segments.push({ kind: "text", text: text.slice(last) });
  return segments;
};

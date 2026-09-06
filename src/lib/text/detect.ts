const STRONG_SIGNALS: readonly RegExp[] = [
  /^#{1,6}\s+\S/m,
  /^```/m,
  /\*\*[^*\n]+\*\*/,
  /__[^_\n]+__/,
  /\[[^\]\n]+\]\([^)\s]+\)/,
  /`[^`\n]+`/,
  /^>\s+\S/m,
  /^\s*[-*+]\s+\[[ xX]\]\s/m,
  /^\|.+\|\s*\n\|[\s:|-]+\|/m,
];

const LIST_LINE = /^\s*(?:[-*+]|\d+\.)\s+\S/gm;

/** Heuristic: does this pasted text look like Markdown rather than prose? */
export const looksLikeMarkdown = (text: string): boolean => {
  if (STRONG_SIGNALS.some((signal) => signal.test(text))) return true;
  return (text.match(LIST_LINE)?.length ?? 0) >= 2;
};

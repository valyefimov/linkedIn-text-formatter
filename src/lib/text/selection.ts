export interface Selection {
  start: number;
  end: number;
}

export interface Edit {
  value: string;
  selection: Selection;
}

export type Scope = "word" | "line";

const WORD_CHAR = /[\p{L}\p{N}\p{M}_\u{1D400}-\u{1D7FF}]/u;

/** Offsets are UTF-16 indexes, as used by `HTMLTextAreaElement.selectionStart`. */
const isWordAt = (value: string, index: number): boolean => {
  const code = value.codePointAt(index);
  if (code === undefined) return false;
  if (WORD_CHAR.test(String.fromCodePoint(code))) return true;
  // Second half of a surrogate pair.
  const prev = value.charCodeAt(index);
  return prev >= 0xdc00 && prev <= 0xdfff && index > 0 && isWordAt(value, index - 1);
};

/** Widens an empty selection to the word or line around the caret; non-empty selections are kept. */
export const expandSelection = (value: string, { start, end }: Selection, scope: Scope): Selection => {
  if (scope === "line") {
    const from = value.lastIndexOf("\n", start - 1) + 1;
    const nl = value.indexOf("\n", end);
    return { start: from, end: nl === -1 ? value.length : nl };
  }
  if (start !== end) return { start, end };
  let from = start;
  let to = end;
  while (from > 0 && isWordAt(value, from - 1)) from--;
  while (to < value.length && isWordAt(value, to)) to++;
  return { start: from, end: to };
};

/** Replaces the (expanded) selection with `transform(selectedText)` and selects the result. */
export const transformSelection = (
  value: string,
  selection: Selection,
  scope: Scope,
  transform: (text: string) => string,
): Edit => {
  const range = scope === "line" ? expandSelection(value, selection, "line") : expandSelection(value, selection, "word");
  const replacement = transform(value.slice(range.start, range.end));
  return {
    value: value.slice(0, range.start) + replacement + value.slice(range.end),
    selection: { start: range.start, end: range.start + replacement.length },
  };
};

/** Inserts text at the selection and puts the caret after it. */
export const insertAt = (value: string, { start, end }: Selection, text: string): Edit => ({
  value: value.slice(0, start) + text + value.slice(end),
  selection: { start: start + text.length, end: start + text.length },
});

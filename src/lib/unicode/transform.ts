import { type FontId, originOf, styleChar } from "./fonts";

export const UNDERLINE_MARK = "̲";
export const STRIKE_MARK = "̶";

export type Emphasis = "bold" | "italic";
export type Family = "serif" | "sans";

interface EmphasisAttrs {
  sans: boolean;
  bold: boolean;
  italic: boolean;
}

const EMPHASIS_FONTS: Record<Family, Record<"plain" | "bold" | "italic" | "both", FontId>> = {
  serif: { plain: "normal", bold: "bold", italic: "italic", both: "boldItalic" },
  sans: { plain: "normal", bold: "sansBold", italic: "sansItalic", both: "sansBoldItalic" },
};

const ATTRS_BY_FONT: Partial<Record<FontId, EmphasisAttrs>> = {
  normal: { sans: false, bold: false, italic: false },
  bold: { sans: false, bold: true, italic: false },
  italic: { sans: false, bold: false, italic: true },
  boldItalic: { sans: false, bold: true, italic: true },
  sans: { sans: true, bold: false, italic: false },
  sansBold: { sans: true, bold: true, italic: false },
  sansItalic: { sans: true, bold: false, italic: true },
  sansBoldItalic: { sans: true, bold: true, italic: true },
};

const isMark = (char: string): boolean => char === UNDERLINE_MARK || char === STRIKE_MARK;
const isAsciiLetter = (char: string): boolean => /^[A-Za-z]$/.test(char);

/** Resolves the serif/sans font that has exactly the requested emphasis. */
export const emphasisFont = ({ sans, bold, italic }: EmphasisAttrs): FontId => {
  const fonts = EMPHASIS_FONTS[sans ? "sans" : "serif"];
  if (bold && italic) return fonts.both;
  if (bold) return fonts.bold;
  if (italic) return fonts.italic;
  return fonts.plain;
};

/** Strips every Unicode styling so only plain ASCII (and untouched characters) remain. */
export const normalize = (text: string): string => {
  let out = "";
  for (const char of text) {
    if (isMark(char)) continue;
    out += originOf(char)?.ascii ?? char;
  }
  return out;
};

/** Restyles the whole text in one font, discarding earlier styling. */
export const applyFont = (text: string, font: FontId): string => {
  let out = "";
  for (const char of normalize(text)) out += styleChar(char, font);
  return out;
};

const attrsOf = (char: string): EmphasisAttrs => {
  const origin = originOf(char);
  return (origin && ATTRS_BY_FONT[origin.font]) || ATTRS_BY_FONT.normal!;
};

const hasEmphasis = (char: string, emphasis: Emphasis): boolean => {
  const origin = originOf(char);
  const attrs = origin ? ATTRS_BY_FONT[origin.font] : undefined;
  return attrs?.[emphasis] ?? false;
};

/**
 * Toggles bold or italic on the letters of `text`, keeping the other emphasis and
 * the serif/sans family. If every letter already has it, it is removed.
 */
export const toggleEmphasis = (text: string, emphasis: Emphasis, family: Family = "sans"): string => {
  const chars = Array.from(text);
  const letters = chars.filter((c) => isAsciiLetter(originOf(c)?.ascii ?? c));
  if (letters.length === 0) return text;
  const remove = letters.every((c) => hasEmphasis(c, emphasis));

  return chars
    .map((char) => {
      const origin = originOf(char);
      const ascii = origin?.ascii ?? char;
      if (!isAsciiLetter(ascii)) return char;
      if (origin && !ATTRS_BY_FONT[origin.font]) return char;
      const attrs = origin ? attrsOf(char) : { sans: family === "sans", bold: false, italic: false };
      return styleChar(ascii, emphasisFont({ ...attrs, [emphasis]: !remove }));
    })
    .join("");
};

const hasMarkAfter = (chars: string[], index: number, mark: string): boolean => {
  for (let i = index + 1; i < chars.length && isMark(chars[i]!); i++) if (chars[i] === mark) return true;
  return false;
};

const isFullyMarked = (text: string, mark: string): boolean => {
  const chars = Array.from(text);
  const targets = chars.filter((c) => !isMark(c) && c.trim() !== "");
  if (targets.length === 0) return false;
  return chars.every((c, i) => isMark(c) || c.trim() === "" || hasMarkAfter(chars, i, mark));
};

const addMark = (text: string, mark: string): string => {
  const chars = Array.from(text);
  let out = "";
  chars.forEach((char, i) => {
    out += char;
    if (isMark(char) || char.trim() === "" || hasMarkAfter(chars, i, mark)) return;
    out += mark;
  });
  return out;
};

const removeMark = (text: string, mark: string): string => Array.from(text).filter((c) => c !== mark).join("");

const toggleMark = (text: string, mark: string): string =>
  isFullyMarked(text, mark) ? removeMark(text, mark) : addMark(text, mark);

export const toggleUnderline = (text: string): string => toggleMark(text, UNDERLINE_MARK);
export const toggleStrike = (text: string): string => toggleMark(text, STRIKE_MARK);

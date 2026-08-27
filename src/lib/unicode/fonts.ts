export type FontId =
  | "normal"
  | "bold"
  | "italic"
  | "boldItalic"
  | "sans"
  | "sansBold"
  | "sansItalic"
  | "sansBoldItalic"
  | "script"
  | "boldScript"
  | "fraktur"
  | "boldFraktur"
  | "doublestruck"
  | "monospace"
  | "fullwidth"
  | "circled";

export interface FontDef {
  id: FontId;
  label: string;
  /** First code point of "A"; the 26 capitals are contiguous. */
  upper: number;
  /** First code point of "a"; the 26 lowercase letters are contiguous. */
  lower: number;
  /** Code points for "0".."9" when the font has digits. */
  digits?: readonly number[];
  /** Letters whose code point is not in the contiguous block (Unicode reserved holes). */
  exceptions?: Readonly<Record<string, number>>;
}

const range = (start: number, length = 10): number[] =>
  Array.from({ length }, (_, i) => start + i);

export const FONTS: readonly FontDef[] = [
  { id: "bold", label: "Bold", upper: 0x1d400, lower: 0x1d41a, digits: range(0x1d7ce) },
  {
    id: "italic",
    label: "Italic",
    upper: 0x1d434,
    lower: 0x1d44e,
    exceptions: { h: 0x210e },
  },
  { id: "boldItalic", label: "Bold Italic", upper: 0x1d468, lower: 0x1d482 },
  { id: "sans", label: "Sans", upper: 0x1d5a0, lower: 0x1d5ba, digits: range(0x1d7e2) },
  { id: "sansBold", label: "Bold Sans", upper: 0x1d5d4, lower: 0x1d5ee, digits: range(0x1d7ec) },
  { id: "sansItalic", label: "Italic Sans", upper: 0x1d608, lower: 0x1d622 },
  { id: "sansBoldItalic", label: "Bold Italic Sans", upper: 0x1d63c, lower: 0x1d656 },
  {
    id: "script",
    label: "Script",
    upper: 0x1d49c,
    lower: 0x1d4b6,
    exceptions: {
      B: 0x212c,
      E: 0x2130,
      F: 0x2131,
      H: 0x210b,
      I: 0x2110,
      L: 0x2112,
      M: 0x2133,
      R: 0x211b,
      e: 0x212f,
      g: 0x210a,
      o: 0x2134,
    },
  },
  { id: "boldScript", label: "Bold Script", upper: 0x1d4d0, lower: 0x1d4ea },
  {
    id: "fraktur",
    label: "Fraktur",
    upper: 0x1d504,
    lower: 0x1d51e,
    exceptions: { C: 0x212d, H: 0x210c, I: 0x2111, R: 0x211c, Z: 0x2128 },
  },
  { id: "boldFraktur", label: "Bold Fraktur", upper: 0x1d56c, lower: 0x1d586 },
  {
    id: "doublestruck",
    label: "Doublestruck",
    upper: 0x1d538,
    lower: 0x1d552,
    digits: range(0x1d7d8),
    exceptions: {
      C: 0x2102,
      H: 0x210d,
      N: 0x2115,
      P: 0x2119,
      Q: 0x211a,
      R: 0x211d,
      Z: 0x2124,
    },
  },
  { id: "monospace", label: "Monospace", upper: 0x1d670, lower: 0x1d68a, digits: range(0x1d7f6) },
  { id: "fullwidth", label: "Fullwidth", upper: 0xff21, lower: 0xff41, digits: range(0xff10) },
  {
    id: "circled",
    label: "Circled",
    upper: 0x24b6,
    lower: 0x24d0,
    digits: [0x24ea, ...range(0x2460, 9)],
  },
];

const CODE_A = 0x41;
const CODE_a = 0x61;
const CODE_0 = 0x30;

const FONT_BY_ID = new Map<FontId, FontDef>(FONTS.map((f) => [f.id, f]));

export interface GlyphOrigin {
  font: FontId;
  ascii: string;
}

/** Maps every styled code point back to its font and plain ASCII character. */
const REVERSE = new Map<number, GlyphOrigin>();

const forEachGlyph = (font: FontDef, visit: (ascii: string, codePoint: number) => void): void => {
  for (let i = 0; i < 26; i++) {
    const upper = String.fromCharCode(CODE_A + i);
    const lower = String.fromCharCode(CODE_a + i);
    visit(upper, font.exceptions?.[upper] ?? font.upper + i);
    visit(lower, font.exceptions?.[lower] ?? font.lower + i);
  }
  font.digits?.forEach((codePoint, i) => visit(String(i), codePoint));
};

for (const font of FONTS) {
  forEachGlyph(font, (ascii, codePoint) => REVERSE.set(codePoint, { font: font.id, ascii }));
}

export const getFont = (id: FontId): FontDef | undefined => FONT_BY_ID.get(id);

/** Returns the styled glyph for an ASCII character, or the character unchanged. */
export const styleChar = (char: string, fontId: FontId): string => {
  const font = FONT_BY_ID.get(fontId);
  if (!font || char.length !== 1) return char;
  const code = char.charCodeAt(0);
  if ((code >= CODE_A && code < CODE_A + 26) || (code >= CODE_a && code < CODE_a + 26)) {
    const exception = font.exceptions?.[char];
    if (exception !== undefined) return String.fromCodePoint(exception);
    const isUpper = code < CODE_a;
    const base = isUpper ? font.upper : font.lower;
    return String.fromCodePoint(base + code - (isUpper ? CODE_A : CODE_a));
  }
  if (code >= CODE_0 && code <= CODE_0 + 9) {
    const digit = font.digits?.[code - CODE_0];
    return digit === undefined ? char : String.fromCodePoint(digit);
  }
  return char;
};

/** Identifies the styled glyph's origin, or `null` for characters outside every font. */
export const originOf = (char: string): GlyphOrigin | null => {
  const codePoint = char.codePointAt(0);
  return codePoint === undefined ? null : (REVERSE.get(codePoint) ?? null);
};

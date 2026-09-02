import { type Token, type Tokens, marked } from "marked";
import { type Family, emphasisFont, styleChar, toggleStrike } from "../unicode";

export type CodeStyle = "monospace" | "bold";

export interface MarkdownOptions {
  /** Serif or sans glyphs for bold and italic. */
  family: Family;
  /** How inline code and code blocks are emphasised. */
  codeStyle: CodeStyle;
}

export const DEFAULT_MARKDOWN_OPTIONS: MarkdownOptions = {
  family: "sans",
  codeStyle: "monospace",
};

interface InlineState {
  bold: boolean;
  italic: boolean;
  strike: boolean;
  mono: boolean;
}

const PLAIN: InlineState = { bold: false, italic: false, strike: false, mono: false };
const BULLETS = ["•", "◦", "▪"] as const;
const RULE = "───────────────";
const QUOTE_BAR = "▎ ";

const styleText = (text: string, state: InlineState, options: MarkdownOptions): string => {
  const font = state.mono
    ? "monospace"
    : emphasisFont({ sans: options.family === "sans", bold: state.bold, italic: state.italic });
  let out = "";
  for (const char of text) out += styleChar(char, font);
  return state.strike ? toggleStrike(out) : out;
};

const renderInline = (tokens: Token[] | undefined, state: InlineState, options: MarkdownOptions): string =>
  (tokens ?? []).map((token) => renderInlineToken(token, state, options)).join("");

const renderInlineToken = (token: Token, state: InlineState, options: MarkdownOptions): string => {
  switch (token.type) {
    case "strong":
      return renderInline((token as Tokens.Strong).tokens, { ...state, bold: true }, options);
    case "em":
      return renderInline((token as Tokens.Em).tokens, { ...state, italic: true }, options);
    case "del":
      return renderInline((token as Tokens.Del).tokens, { ...state, strike: true }, options);
    case "codespan": {
      const code: InlineState =
        options.codeStyle === "monospace" ? { ...state, mono: true } : { ...state, bold: true };
      return styleText((token as Tokens.Codespan).text, code, options);
    }
    case "link": {
      const link = token as Tokens.Link;
      const label = renderInline(link.tokens, state, options);
      return link.text === link.href || link.href.startsWith("mailto:") ? label : `${label} (${link.href})`;
    }
    case "image":
      return styleText((token as Tokens.Image).text, state, options);
    case "br":
      return "\n";
    case "text": {
      const text = token as Tokens.Text;
      return text.tokens ? renderInline(text.tokens, state, options) : styleText(text.text, state, options);
    }
    default:
      return styleText("text" in token && typeof token.text === "string" ? token.text : token.raw, state, options);
  }
};

const renderCode = (code: string, options: MarkdownOptions): string => {
  const state: InlineState =
    options.codeStyle === "monospace" ? { ...PLAIN, mono: true } : { ...PLAIN, bold: true };
  return code
    .split("\n")
    .map((line) => styleText(line, state, options))
    .join("\n");
};

const indent = (text: string, width: number): string => {
  const pad = " ".repeat(width);
  return text
    .split("\n")
    .map((line, i) => (i === 0 || line === "" ? line : pad + line))
    .join("\n");
};

const renderList = (list: Tokens.List, depth: number, options: MarkdownOptions): string => {
  const start = typeof list.start === "number" ? list.start : 1;
  return list.items
    .map((item, i) => {
      const marker = item.task
        ? item.checked
          ? "☑"
          : "☐"
        : list.ordered
          ? `${start + i}.`
          : BULLETS[depth % BULLETS.length]!;
      const body = renderBlocks(
        item.tokens.filter((t) => t.type !== "checkbox"),
        depth + 1,
        options,
        "\n",
      );
      return `${marker} ${indent(body, 2)}`;
    })
    .join("\n");
};

const renderTable = (table: Tokens.Table, options: MarkdownOptions): string => {
  const cell = (c: Tokens.TableCell, header: boolean): string =>
    renderInline(c.tokens, header ? { ...PLAIN, bold: true } : PLAIN, options);
  const header = table.header.map((c) => cell(c, true)).join(" │ ");
  const rows = table.rows.map((row) => row.map((c) => cell(c, false)).join(" │ "));
  return [header, RULE, ...rows].join("\n");
};

const renderBlock = (token: Token, depth: number, options: MarkdownOptions): string | null => {
  switch (token.type) {
    case "heading":
      return renderInline((token as Tokens.Heading).tokens, { ...PLAIN, bold: true }, options);
    case "paragraph":
    case "text":
      return renderInline((token as Tokens.Paragraph).tokens, PLAIN, options);
    case "code":
      return renderCode((token as Tokens.Code).text, options);
    case "blockquote": {
      const inner = renderBlocks((token as Tokens.Blockquote).tokens, depth, options);
      return inner
        .split("\n")
        .map((line) => (line === "" ? line : QUOTE_BAR + line))
        .join("\n");
    }
    case "list":
      return renderList(token as Tokens.List, depth, options);
    case "hr":
      return RULE;
    case "table":
      return renderTable(token as Tokens.Table, options);
    case "html":
      return (token as Tokens.HTML).text.trim();
    case "space":
    case "def":
      return null;
    default:
      return token.raw.trim() || null;
  }
};

const renderBlocks = (tokens: Token[], depth: number, options: MarkdownOptions, separator = "\n\n"): string =>
  tokens
    .map((token) => renderBlock(token, depth, options))
    .filter((block): block is string => block !== null && block !== "")
    .join(separator);

/** Converts Markdown to LinkedIn-ready plain text using Unicode styling. */
export const markdownToUnicode = (
  markdown: string,
  options: MarkdownOptions = DEFAULT_MARKDOWN_OPTIONS,
): string => renderBlocks(marked.lexer(markdown), 0, options);

import { describe, expect, it } from "vitest";
import { DEFAULT_MARKDOWN_OPTIONS, type MarkdownOptions, markdownToUnicode } from "./convert";

const serif: MarkdownOptions = { ...DEFAULT_MARKDOWN_OPTIONS, family: "serif" };
const convert = (md: string, options?: Partial<MarkdownOptions>): string =>
  markdownToUnicode(md, { ...DEFAULT_MARKDOWN_OPTIONS, ...options });

describe("inline formatting", () => {
  it("converts bold and italic", () => {
    expect(convert("**Hi** and _you_")).toBe("𝗛𝗶 and 𝘺𝘰𝘶");
  });

  it("nests bold inside italic into bold italic", () => {
    expect(convert("_**Hi**_")).toBe("𝙃𝙞");
  });

  it("supports the serif family", () => {
    expect(markdownToUnicode("**Hi**", serif)).toBe("𝐇𝐢");
  });

  it("strikes through deleted text", () => {
    expect(convert("~~no~~")).toBe("n̶o̶");
  });

  it("keeps plain text, ampersands and angle brackets literally", () => {
    expect(convert("a & b <c>")).toBe("a & b <c>");
  });

  it("keeps non-Latin text untouched while styling it", () => {
    expect(convert("**Привет**")).toBe("Привет");
  });
});

describe("links and images", () => {
  it("appends the URL after the label", () => {
    expect(convert("[docs](https://a.dev)")).toBe("docs (https://a.dev)");
  });

  it("does not repeat a bare URL", () => {
    expect(convert("<https://a.dev>")).toBe("https://a.dev");
  });

  it("uses the alt text for images", () => {
    expect(convert("![logo](x.png)")).toBe("logo");
  });
});

describe("code", () => {
  it("renders inline code monospaced", () => {
    expect(convert("run `npm i`")).toBe("run 𝚗𝚙𝚖 𝚒");
  });

  it("renders code blocks monospaced line by line", () => {
    expect(convert("```ts\nconst a = 1;\nb()\n```")).toBe("𝚌𝚘𝚗𝚜𝚝 𝚊 = 𝟷;\n𝚋()");
  });

  it("can render code bold instead", () => {
    expect(convert("`a`", { codeStyle: "bold" })).toBe("𝗮");
    expect(convert("```\nab\n```", { codeStyle: "bold" })).toBe("𝗮𝗯");
  });
});

describe("blocks", () => {
  it("renders headings bold and separates paragraphs with a blank line", () => {
    expect(convert("# Title\n\nBody")).toBe("𝗧𝗶𝘁𝗹𝗲\n\nBody");
  });

  it("renders bullet lists with depth-based bullets", () => {
    expect(convert("- one\n- two\n  - deep")).toBe("• one\n• two\n  ◦ deep");
  });

  it("renders ordered lists from their start number", () => {
    expect(convert("3. a\n4. b")).toBe("3. a\n4. b");
  });

  it("renders task lists with checkboxes", () => {
    expect(convert("- [x] done\n- [ ] todo")).toBe("☑ done\n☐ todo");
  });

  it("prefixes block quotes with a bar", () => {
    expect(convert("> wise\n> words")).toBe("▎ wise\n▎ words");
  });

  it("renders horizontal rules", () => {
    expect(convert("a\n\n---\n\nb")).toBe("a\n\n───────────────\n\nb");
  });

  it("renders tables with bold headers", () => {
    expect(convert("| a | b |\n|---|---|\n| 1 | 2 |")).toBe("𝗮 │ 𝗯\n───────────────\n1 │ 2");
  });

  it("returns an empty string for empty input", () => {
    expect(convert("")).toBe("");
  });
});

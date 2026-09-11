import { describe, expect, it } from "vitest";
import {
  applyFont,
  normalize,
  toggleEmphasis,
  toggleFont,
  toggleStrike,
  toggleUnderline,
} from "./transform";

describe("normalize", () => {
  it("turns styled text back into ASCII", () => {
    expect(normalize("𝗛𝗲𝗹𝗹𝗼 𝟭𝟮𝟯")).toBe("Hello 123");
  });

  it("strips underline and strikethrough marks", () => {
    expect(normalize(toggleUnderline("Hi"))).toBe("Hi");
    expect(normalize(toggleStrike("Hi"))).toBe("Hi");
  });

  it("keeps non-Latin text and emoji", () => {
    expect(normalize("Привет 🚀")).toBe("Привет 🚀");
  });
});

describe("applyFont", () => {
  it("styles plain text", () => {
    expect(applyFont("Hello", "bold")).toBe("𝐇𝐞𝐥𝐥𝐨");
  });

  it("replaces an earlier style instead of stacking", () => {
    expect(applyFont("𝐇𝐞𝐥𝐥𝐨", "monospace")).toBe("𝙷𝚎𝚕𝚕𝚘");
  });

  it("is a no-op for the normal font", () => {
    expect(applyFont("𝐇𝐞𝐥𝐥𝐨", "normal")).toBe("Hello");
  });
});

describe("toggleEmphasis", () => {
  it("bolds plain text in the sans family by default", () => {
    expect(toggleEmphasis("Hi", "bold")).toBe("𝗛𝗶");
  });

  it("respects the serif family", () => {
    expect(toggleEmphasis("Hi", "bold", "serif")).toBe("𝐇𝐢");
  });

  it("removes bold when every letter already has it", () => {
    expect(toggleEmphasis("𝗛𝗶", "bold")).toBe("Hi");
  });

  it("combines bold and italic and removes only one of them", () => {
    const boldItalic = toggleEmphasis(toggleEmphasis("Hi", "bold"), "italic");
    expect(boldItalic).toBe("𝙃𝙞");
    expect(toggleEmphasis(boldItalic, "italic")).toBe("𝗛𝗶");
  });

  it("adds bold to the rest when only part of the text is bold", () => {
    expect(toggleEmphasis("𝗛i", "bold")).toBe("𝗛𝗶");
  });

  it("leaves digits and spaces alone and keeps other fonts", () => {
    expect(toggleEmphasis("a 1", "bold")).toBe("𝗮 1");
    expect(toggleEmphasis("𝚑i", "bold")).toBe("𝚑𝗶");
  });

  it("returns text without letters unchanged", () => {
    expect(toggleEmphasis("123 !?", "bold")).toBe("123 !?");
  });
});

describe("underline and strikethrough", () => {
  it("marks every visible character but not spaces", () => {
    expect(toggleUnderline("a b")).toBe("a̲ b̲");
    expect(toggleStrike("a b")).toBe("a̶ b̶");
  });

  it("toggles back off", () => {
    expect(toggleUnderline(toggleUnderline("hello world"))).toBe("hello world");
  });

  it("fills in missing marks instead of doubling them", () => {
    expect(toggleUnderline("a̲b")).toBe("a̲b̲");
  });

  it("combines with other styles", () => {
    const text = toggleStrike(toggleUnderline("ab"));
    expect(toggleUnderline(text)).toBe("a̶b̶");
  });
});

describe("toggleFont", () => {
  it("applies the font and removes it again", () => {
    expect(toggleFont("ab 1", "monospace")).toBe("𝚊𝚋 𝟷");
    expect(toggleFont("𝚊𝚋 𝟷", "monospace")).toBe("ab 1");
  });

  it("replaces a different font", () => {
    expect(toggleFont("𝗮𝗯", "monospace")).toBe("𝚊𝚋");
  });

  it("ignores text without letters", () => {
    expect(toggleFont("123", "monospace")).toBe("123");
  });
});

import { describe, expect, it } from "vitest";
import { countChars, foldText, getUsage, readingSeconds, wordCount } from "./limits";

describe("countChars", () => {
  it("counts styled and emoji characters once", () => {
    expect(countChars("𝗛𝗶")).toBe(2);
    expect(countChars("a🚀")).toBe(2);
  });
});

describe("getUsage", () => {
  it("reports ok, warn and over states", () => {
    expect(getUsage("a".repeat(100), 1000).state).toBe("ok");
    expect(getUsage("a".repeat(900), 1000).state).toBe("warn");
    expect(getUsage("a".repeat(1000), 1000).state).toBe("warn");
    expect(getUsage("a".repeat(1001), 1000).state).toBe("over");
  });

  it("reports remaining characters, negative when over", () => {
    expect(getUsage("abc", 10).remaining).toBe(7);
    expect(getUsage("abcdef", 3).remaining).toBe(-3);
  });
});

describe("foldText", () => {
  it("does not truncate short text", () => {
    expect(foldText("short", "desktop")).toEqual({ visible: "short", hidden: "", truncated: false });
  });

  it("truncates by characters per device", () => {
    const text = "a".repeat(300);
    expect(foldText(text, "desktop").visible).toHaveLength(210);
    expect(foldText(text, "mobile").visible).toHaveLength(140);
    expect(foldText(text, "mobile").hidden).toHaveLength(160);
  });

  it("truncates after three lines even when short", () => {
    const fold = foldText("a\nb\nc\nd\ne", "desktop");
    expect(fold.visible).toBe("a\nb\nc");
    expect(fold.truncated).toBe(true);
  });
});

describe("reading time", () => {
  it("counts words and estimates seconds", () => {
    expect(wordCount("  one two\nthree ")).toBe(3);
    expect(wordCount("")).toBe(0);
    expect(readingSeconds("word ".repeat(230))).toBe(60);
  });
});

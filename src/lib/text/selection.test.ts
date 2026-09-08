import { describe, expect, it } from "vitest";
import { expandSelection, insertAt, transformSelection } from "./selection";

describe("expandSelection", () => {
  it("expands a caret to the surrounding word", () => {
    expect(expandSelection("say hello now", { start: 6, end: 6 }, "word")).toEqual({ start: 4, end: 9 });
  });

  it("keeps an existing selection", () => {
    expect(expandSelection("say hello", { start: 1, end: 3 }, "word")).toEqual({ start: 1, end: 3 });
  });

  it("includes already styled letters in the word", () => {
    const value = "a 𝗛𝗶 b";
    expect(expandSelection(value, { start: 3, end: 3 }, "word")).toEqual({ start: 2, end: 6 });
  });

  it("returns an empty range on whitespace between words", () => {
    expect(expandSelection("a  b", { start: 2, end: 2 }, "word")).toEqual({ start: 2, end: 2 });
  });

  it("expands to full lines, even for a selection spanning several", () => {
    const value = "one\ntwo\nthree";
    expect(expandSelection(value, { start: 5, end: 5 }, "line")).toEqual({ start: 4, end: 7 });
    expect(expandSelection(value, { start: 2, end: 9 }, "line")).toEqual({ start: 0, end: 13 });
  });
});

describe("transformSelection", () => {
  it("replaces the range and selects the replacement", () => {
    const edit = transformSelection("say hello", { start: 6, end: 6 }, "word", (t) => t.toUpperCase());
    expect(edit).toEqual({ value: "say HELLO", selection: { start: 4, end: 9 } });
  });

  it("reports the selection in UTF-16 units for astral replacements", () => {
    const edit = transformSelection("hi", { start: 0, end: 2 }, "word", () => "𝗛𝗶");
    expect(edit.selection).toEqual({ start: 0, end: 4 });
  });
});

describe("insertAt", () => {
  it("inserts at the caret and moves it after the text", () => {
    expect(insertAt("ab", { start: 1, end: 1 }, "🚀")).toEqual({
      value: "a🚀b",
      selection: { start: 3, end: 3 },
    });
  });

  it("replaces a selection", () => {
    expect(insertAt("abc", { start: 0, end: 2 }, "x").value).toBe("xc");
  });
});

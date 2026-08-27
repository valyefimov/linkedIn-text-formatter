import { describe, expect, it } from "vitest";
import { FONTS, originOf, styleChar } from "./fonts";

describe("styleChar", () => {
  it("maps ASCII letters into the bold block", () => {
    expect(styleChar("A", "bold")).toBe("𝐀");
    expect(styleChar("z", "bold")).toBe("𝐳");
  });

  it("maps digits when the font has them", () => {
    expect(styleChar("7", "bold")).toBe("𝟕");
    expect(styleChar("0", "monospace")).toBe("𝟶");
    expect(styleChar("0", "circled")).toBe("⓪");
    expect(styleChar("3", "circled")).toBe("③");
  });

  it("leaves digits alone when the font has none", () => {
    expect(styleChar("5", "italic")).toBe("5");
  });

  it("uses exceptions for reserved holes in the Unicode blocks", () => {
    expect(styleChar("h", "italic")).toBe("ℎ");
    expect(styleChar("B", "script")).toBe("ℬ");
    expect(styleChar("C", "doublestruck")).toBe("ℂ");
    expect(styleChar("R", "fraktur")).toBe("ℜ");
  });

  it("does not touch non-letters", () => {
    expect(styleChar(" ", "bold")).toBe(" ");
    expect(styleChar("!", "monospace")).toBe("!");
  });
});

describe("originOf", () => {
  it("round-trips every glyph of every font back to ASCII", () => {
    for (const font of FONTS) {
      for (const ascii of "AZaz09Bhe") {
        const styled = styleChar(ascii, font.id);
        if (styled === ascii) continue;
        expect(originOf(styled)).toEqual({ font: font.id, ascii });
      }
    }
  });

  it("returns null for plain characters", () => {
    expect(originOf("a")).toBeNull();
    expect(originOf("я")).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { keepBlankLines } from "./paste";

describe("keepBlankLines", () => {
  it("fills blank and whitespace-only lines with a Braille blank", () => {
    expect(keepBlankLines("a\n\nb\n  \nc")).toBe("a\n⠀\nb\n⠀\nc");
  });

  it("normalizes CRLF", () => {
    expect(keepBlankLines("a\r\n\r\nb")).toBe("a\n⠀\nb");
  });

  it("leaves text without blank lines unchanged", () => {
    expect(keepBlankLines("a\nb")).toBe("a\nb");
  });
});

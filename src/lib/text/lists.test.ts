import { describe, expect, it } from "vitest";
import { toggleList } from "./lists";

describe("toggleList", () => {
  it("adds bullets to every non-empty line and keeps blank lines", () => {
    expect(toggleList("a\n\nb", "bullet")).toBe("• a\n\n• b");
  });

  it("numbers lines sequentially, skipping blanks", () => {
    expect(toggleList("a\n\nb\nc", "numbered")).toBe("1. a\n\n2. b\n3. c");
  });

  it("creates checklists and arrows", () => {
    expect(toggleList("a", "check")).toBe("☐ a");
    expect(toggleList("a", "arrow")).toBe("→ a");
  });

  it("removes the markers when the whole selection already has them", () => {
    expect(toggleList("• a\n• b", "bullet")).toBe("a\nb");
    expect(toggleList("1. a\n2. b", "numbered")).toBe("a\nb");
    expect(toggleList("☑ a\n☐ b", "check")).toBe("a\nb");
  });

  it("replaces another list kind instead of stacking", () => {
    expect(toggleList("• a\n• b", "numbered")).toBe("1. a\n2. b");
  });

  it("adds markers to the remaining lines of a partial list", () => {
    expect(toggleList("• a\nb", "bullet")).toBe("• a\n• b");
  });

  it("ignores empty text", () => {
    expect(toggleList("", "bullet")).toBe("");
    expect(toggleList("  \n ", "bullet")).toBe("  \n ");
  });
});

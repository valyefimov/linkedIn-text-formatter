import { describe, expect, it } from "vitest";
import { otherTheme, resolveTheme } from "./theme";

describe("resolveTheme", () => {
  it("prefers a stored choice over the system", () => {
    expect(resolveTheme("dark", true)).toBe("dark");
    expect(resolveTheme("light", false)).toBe("light");
  });

  it("falls back to the system preference for missing or invalid values", () => {
    expect(resolveTheme(null, true)).toBe("light");
    expect(resolveTheme("sepia", false)).toBe("dark");
  });
});

describe("otherTheme", () => {
  it("flips the theme", () => {
    expect(otherTheme("dark")).toBe("light");
    expect(otherTheme("light")).toBe("dark");
  });
});

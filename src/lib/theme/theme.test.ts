import { describe, expect, it } from "vitest";
import { otherTheme, resolveTheme } from "./theme";

describe("resolveTheme", () => {
  it("keeps a stored choice", () => {
    expect(resolveTheme("dark")).toBe("dark");
    expect(resolveTheme("light")).toBe("light");
  });

  it("defaults to light for missing or invalid values", () => {
    expect(resolveTheme(null)).toBe("light");
    expect(resolveTheme("sepia")).toBe("light");
  });
});

describe("otherTheme", () => {
  it("flips the theme", () => {
    expect(otherTheme("dark")).toBe("light");
    expect(otherTheme("light")).toBe("dark");
  });
});

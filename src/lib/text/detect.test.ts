import { describe, expect, it } from "vitest";
import { looksLikeMarkdown } from "./detect";

describe("looksLikeMarkdown", () => {
  it.each([
    "# Title",
    "some **bold** text",
    "run `npm i`",
    "```\ncode\n```",
    "see [docs](https://a.dev)",
    "> quote",
    "- [ ] todo",
    "- one\n- two",
    "1. one\n2. two",
    "| a | b |\n|---|---|\n| 1 | 2 |",
  ])("detects %j", (text) => {
    expect(looksLikeMarkdown(text)).toBe(true);
  });

  it.each(["Just a sentence.", "- a single dash line", "price is 5 * 3 = 15", "2025. a year", ""])(
    "ignores %j",
    (text) => {
      expect(looksLikeMarkdown(text)).toBe(false);
    },
  );
});

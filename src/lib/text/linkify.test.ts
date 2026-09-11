import { describe, expect, it } from "vitest";
import { linkify } from "./linkify";

describe("linkify", () => {
  it("finds hashtags, mentions and urls", () => {
    expect(linkify("hi #dev @ann see https://a.dev/x.")).toEqual([
      { kind: "text", text: "hi " },
      { kind: "hashtag", text: "#dev" },
      { kind: "text", text: " " },
      { kind: "mention", text: "@ann" },
      { kind: "text", text: " see " },
      { kind: "url", text: "https://a.dev/x" },
      { kind: "text", text: "." },
    ]);
  });

  it("supports non-Latin hashtags", () => {
    expect(linkify("#привет")).toEqual([{ kind: "hashtag", text: "#привет" }]);
  });

  it("does not treat emails or mid-word hashes as links", () => {
    expect(linkify("a@b.com c#d")).toEqual([{ kind: "text", text: "a@b.com c#d" }]);
  });

  it("returns plain text unchanged", () => {
    expect(linkify("nothing here")).toEqual([{ kind: "text", text: "nothing here" }]);
    expect(linkify("")).toEqual([]);
  });
});

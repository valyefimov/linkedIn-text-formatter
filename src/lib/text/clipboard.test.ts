import { describe, expect, it } from "vitest";
import { toClipboardHtml } from "./clipboard";

describe("toClipboardHtml", () => {
  it("wraps each line in a paragraph and keeps blank lines", () => {
    expect(toClipboardHtml("a\n\nb")).toBe("<p>a</p><p><br></p><p>b</p>");
  });

  it("normalizes CRLF and escapes markup", () => {
    expect(toClipboardHtml("<b>&\r\nx")).toBe("<p>&lt;b&gt;&amp;</p><p>x</p>");
  });
});
